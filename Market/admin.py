from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.Firm)

admin.site.register(models.UserAccount)

admin.site.register(models.Stock_Transaction)

admin.site.register(models.Stock_Record)