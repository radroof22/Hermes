# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-04-15 21:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Market', '0006_auto_20170415_1714'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stock_transaction',
            name='Date_Time',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
