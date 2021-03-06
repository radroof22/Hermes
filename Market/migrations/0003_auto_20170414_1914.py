# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-04-14 23:14
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Market', '0002_auto_20170413_1357'),
    ]

    operations = [
        migrations.CreateModel(
            name='Stock_Record',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Ticker', models.CharField(max_length=10)),
                ('Number_of_Shares', models.IntegerField()),
                ('Quote_Each', models.FloatField()),
                ('Value', models.FloatField()),
                ('Account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Market.UserAccount')),
            ],
        ),
        migrations.AddField(
            model_name='stock_transaction',
            name='Total_Cost',
            field=models.FloatField(default=100),
            preserve_default=False,
        ),
    ]
