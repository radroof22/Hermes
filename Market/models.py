from django.db import models
from django.contrib.auth.models import User
from multiselectfield import MultiSelectField

# Create your models here.

#lobby's for user to join to compete
class Firm(models.Model):
    Name = models.CharField(max_length = 200)
    
    def __str__(self):
        return str(self.Name)

#accounts for users to use to play
class UserAccount(models.Model):
    Money = models.FloatField(default=100000.00)
    User = models.ForeignKey(User)
    Firm = models.ForeignKey(Firm, blank=True, null=True)

    def __str__(self):
        return str(self.User.username)

TRANSACTION_TYPES = (
                    ("Buy", "Buy"),
                    ("Sell", "Sell"),
)

#records transaction for each user
class Stock_Transaction(models.Model):
    Ticker = models.CharField(max_length=10)
    Number_of_Shares = models.IntegerField()
    Quote_Each = models.FloatField()
    Total_Cost = models.FloatField()
    Account = models.ForeignKey(UserAccount)
    Type = MultiSelectField(choices=TRANSACTION_TYPES)
    Date_Time = models.DateTimeField(auto_now_add=True)
    Balance_at_Time = models.FloatField()

    def __str__(self):
        # AMZN x20 - EpicTradex
        return "{} *** {} x{} - {}".format(self.Type,self.Ticker, self.Number_of_Shares, self.Account.User.username)

    def check_same_datetime(self, possible_datetime, fields={"Year":0,"Month":1, "Day":2}):
        date_time_list = list(self.Date_Time.timetuple())
        possible_datetime_list = list(possible_datetime.timetuple())
        #loop through all conditions
        for name, index_number in fields.items():
            if date_time_list[index_number] != possible_datetime_list[index_number]:
                return False
        return True


class Stock_Record(models.Model):
    Ticker = models.CharField(max_length=10)
    Number_of_Shares = models.IntegerField()
    Quote_Each = models.FloatField()
    Value = models.FloatField()
    Account = models.ForeignKey(UserAccount)
    Date_Time = models.DateTimeField(auto_now=False, auto_now_add=False)
