# Generated by Django 4.1.7 on 2023-03-10 09:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_alter_about_text'),
    ]

    operations = [
        migrations.CreateModel(
            name='Faqs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=200)),
                ('answer', models.CharField(max_length=200)),
            ],
        ),
    ]
