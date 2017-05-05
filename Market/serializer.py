from . import models
from rest_framework import serializers
from django.contrib.auth.models import User

class Stock_Transaction_API(serializers.ModelSerializer):
    class Meta:
        model = models.Stock_Transaction
        fields = ("id", "Account", "Date_Time", "Balance_at_Time")

class UserAccount_API(serializers.ModelSerializer):
    class Meta:
        model = models.UserAccount
        fields = ("id", "Money", "User", "Firm")

class User_API(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")