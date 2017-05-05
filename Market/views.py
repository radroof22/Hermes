from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from rest_framework import status,generics
from . import services as Market
from . import models
from . import serializer
# Create your views here.

#home page view
def Home(request):
    #important values for rest of function
    user = request.user
                #Cisco    bankAmeri Amazon AT&t Exxon  GenElec ProctorGamble
    headlines = ["CSCO", "BAC", "AMZN", "T", "XOM", "GE", "PG"] 

    return render(request, "Market/index.html", {"user":request.user, "firm":Market.get_firm(request.user)})

@login_required(redirect_field_name='/accounts/login')
def Create_Firm(request):
    #important values for passing to html
    user = request.user
    if request.method == "POST":
        #create new firm
        firm = Market.create_firm(request.POST.get("firm_name"))

        #user joins new firm
        Market.set_firm(user, firm)
        return HttpResponseRedirect("/accounts/profile")
    else:
        return render(request, "Market/firm_form.html",{"user":user, "firm":Market.get_firm(user)})

@login_required(redirect_field_name='/accounts/login')
def Join_Firm(request):
    #important values for passing to html
    user = request.user
    if request.method == "POST":
        #set user's firm to a new firm that they want to join
        Market.set_firm(user, models.Firm.objects.get(Name=request.POST.get("join_firm")))
        return HttpResponseRedirect("/view/firm")
    else:
        return render(request, "Market/firm_list.html", {"user":user,"firms":models.Firm.objects.all(),"firm":Market.get_firm(user)})
@login_required(redirect_field_name='/accounts/login')
def View_Firm(request):

    #important value
    user = request.user
    users_renders = {}
    for i in User.objects.all():
        users_renders[i.id] = str(i.username) 
    return render(request, "Market/firm_view.html", {"user":user,"firm":Market.get_firm(user),"firm_accounts":models.UserAccount.objects.filter(Firm=Market.get_firm(user))})

@login_required(redirect_field_name='/accounts/login')
def Leave_Firm(request):
    #set the users firm to 'No Firm'
    Market.set_firm(request.user, None)
    #redirect to wear user can join a firm
    return HttpResponseRedirect("/join/firm")

@login_required(redirect_field_name='/accounts/login')
def Profile(request):
    #important values for passing to html
    user = request.user
    account = Market.get_UserAccount(user)
    transactions = Market.get_users_transactions(request.user)
    portfolio = models.Stock_Record.objects.filter(Account=account)
    total_portfolio = Market.getTodaysPortfolio(portfolio)
    Market.same_day_condition()

    #if user wants to sell stocks
    if request.method == "POST":
        #get values to conduct transaction
        shares_to_sell = request.POST.get("stock_to_sell")
        stock_row_id = request.POST.get("stock_row_id")
        account = Market.get_UserAccount(user)
        Market.sell_stocks(shares_to_sell, stock_row_id, account)

        return HttpResponseRedirect("/accounts/profile/")
    return render(request,
                 "Market/profile.html", {  
                "user":user, 
                "account":account,
                "firm":Market.get_firm(user),
                "transactions":transactions, 
                "total_portfolio":total_portfolio,
                })
@login_required(redirect_field_name='/accounts/login')
def Search_Stocks(request):
    account = Market.get_UserAccount(request.user)

    if request.method == "POST":
        if request.POST.get("trans_type") == "buy":
            #get html contents needed to enter into db
            number_of_shares = request.POST.get("num_of_shares")
            share_price = request.POST.get("share_price")
            stock_symbol = request.POST.get("stock_symbol").upper()

            Market.buy_stocks(number_of_shares, share_price, stock_symbol, account)

        if request.POST.get("trans_type") == "sell":
            #get html ids needed
            shares_to_sell = request.POST.get("shares_to_sell")
            ticker = request.POST.get("ticker").upper()
            try:
                stock_row = list(models.Stock_Record.objects.filter(Ticker=ticker))[-1]

                print(stock_row.Number_of_Shares)
                print(shares_to_sell)

                if stock_row.Number_of_Shares >= int(shares_to_sell):
                    pass
                else:
                    return render(request, "Market/search_stocks.html", {"account":account, "user":request.user, "firm":Market.get_firm(request.user), "error":"You are selling more stocks than you your last purchase. Use the Profile Page to have an easier time selling your stocks!"})

            except Exception as e:    
                print(e)
                return render(request, "Market/search_stocks.html", {"account":account, "user":request.user, "firm":Market.get_firm(request.user), "error":"You are selling more stocks than you have!"})

            Market.sell_stocks(shares_to_sell, stock_row.id, account)
        
        #redirect to profile page
        return HttpResponseRedirect("/accounts/profile/")


    return render(request, "Market/search_stocks.html", {"account":account, "user":request.user, "firm":Market.get_firm(request.user),})


class Transaction_List(generics.ListCreateAPIView):
    queryset = models.Stock_Transaction.objects.all()
    serializer_class = serializer.Stock_Transaction_API

class UserAccounts_API(generics.ListCreateAPIView):
    queryset = models.UserAccount.objects.all()
    serializer_class = serializer.UserAccount_API

class User_API(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = serializer.User_API