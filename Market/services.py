from yahoo_finance import Share
from . import models
from django.utils import timezone
from  datetime import datetime, timedelta

#Index require '^' before their symbol

def get_stock_price(symbol):
    """ Return [price, open, close, high, low, volume]"""
    stock = Share(symbol)
    return [stock.get_price(), stock.get_open(), stock.get_prev_close(), stock.get_days_high, stock.get_days_low, stock.get_volume]

def create_firm(name): 
    """Create Entry in Database for a Firm"""
    firm_instance = models.Firm(Name=name)
    firm_instance.save()
    return firm_instance

def get_firm(user):
    """Gets the Users Firm"""
    if user.is_anonymous: return "No Firm"
    user_account = get_UserAccount(user)
    return user_account.Firm

def set_firm(user, firm):
    """Gets the Users Firm"""
    user_account = models.UserAccount.objects.get(User=user)
    user_account.Firm = firm
    user_account.save()

def get_UserAccount(user):
    """Get's  UsersAccount"""
    try:
        user_account = models.UserAccount.objects.get(User=user)
    except models.UserAccount.DoesNotExist :
        user_account = models.UserAccount(User=user)
        user_account.save()
    return user_account

def get_users_transactions(user):
    user_account = get_UserAccount(user)
    accounts_transactions = models.Stock_Transaction.objects.filter(Account=user_account)
    return accounts_transactions


def buy_stocks(number_of_shares, share_price, stock_symbol, account):

    #create row for portfolio for user
    stock_purchase = models.Stock_Record(Ticker=stock_symbol, Number_of_Shares=number_of_shares, Quote_Each=share_price, Account=account, Value=float(number_of_shares) * float(share_price), Date_Time=timezone.now())
    stock_purchase.save()

    #change money in account
    account.Money = account.Money - (float(number_of_shares) * float(share_price))
    account.save()

    #create transaction log for user
    transaction = models.Stock_Transaction(Ticker=stock_symbol, Number_of_Shares=number_of_shares, Quote_Each=share_price, Account=account, Total_Cost=float(number_of_shares) * float(share_price), Type="Buy", Date_Time=timezone.now(), Balance_at_Time=account.Money)
    transaction.save()


def sell_stocks(shares_to_sell, stock_row_id, account):
    #update portfolio information
    stock_row = models.Stock_Record.objects.get(id=stock_row_id)
    ticker = stock_row.Ticker
    stock_row.Number_of_Shares = float(stock_row.Number_of_Shares) - float(shares_to_sell)
    #if user sells all stocks, delete stock row
    if float(stock_row.Number_of_Shares) == 0:
        stock_row.delete()
    else:
        stock_row.save()
    

    #search for current price of stock and get current worth of stocks
    stock_price = get_stock_price(ticker)[0]
    sell_value = float(stock_price) * float(shares_to_sell)

    #file transaction report
    transaction = models.Stock_Transaction(Ticker=ticker, Number_of_Shares=shares_to_sell, Quote_Each=stock_price, Account=account, Total_Cost=sell_value, Type="Sell", Balance_at_Time=account.Money)
    transaction.save()

    #update account information
    account.Money = account.Money + float(sell_value)
    account.save()

def same_day_condition():
    yesterday = datetime.today() - timedelta(days=1)
    all_transactions = models.Stock_Transaction.objects.all()

    trans_met = []

    for trans in all_transactions:
        if trans.check_same_datetime(yesterday, fields={"Year":0,"Month":1, "Day":2}): trans_met.append(trans)


def getTodaysPortfolio(portfolio):
    port_today = []
    for stock in portfolio:
        ticker = stock.Ticker
        stock_yhoo = Share(ticker)
        port_today.append({
                            "id":stock.id,
                            "Ticker":ticker,
                            "CurrentPrice": stock_yhoo.get_price(), 
                            "pct_change":stock_yhoo.get_change(),
                            "Quote_Each": stock.Quote_Each,
                            "Number_of_Shares": stock.Number_of_Shares,
                            "Value":stock.Value,
                            "Today_Value": float(stock.Number_of_Shares) * float(stock_yhoo.get_price()),
                            "Date_Time":stock.Date_Time,
                            })
    return port_today
