# Generated by Django 4.1.7 on 2023-03-11 08:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_remove_product_metals'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='gems',
        ),
        migrations.RemoveField(
            model_name='product',
            name='probe',
        ),
    ]