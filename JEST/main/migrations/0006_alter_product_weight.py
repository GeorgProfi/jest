# Generated by Django 4.1.7 on 2023-03-10 11:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_faqs'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='weight',
            field=models.FloatField(),
        ),
    ]
