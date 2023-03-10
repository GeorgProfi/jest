# Generated by Django 4.1.7 on 2023-03-09 13:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('surname', models.CharField(max_length=20)),
                ('email', models.CharField(max_length=20)),
                ('phone_number', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('collection', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Emploee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('surname', models.CharField(max_length=20)),
                ('email', models.CharField(max_length=20)),
                ('phone_number', models.CharField(max_length=20)),
                ('info', models.CharField(max_length=1000)),
            ],
        ),
        migrations.CreateModel(
            name='Files_for_individual_orders',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('files', models.JSONField()),
                ('comment', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sum', models.IntegerField()),
                ('datetime', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30)),
                ('weight', models.IntegerField()),
                ('probe', models.CharField(max_length=30)),
                ('count', models.IntegerField(default=0)),
                ('price', models.IntegerField()),
                ('gems', models.JSONField()),
                ('photos', models.JSONField()),
                ('metals', models.CharField(max_length=30)),
                ('is_active', models.BooleanField(default=False)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='main.category')),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=200)),
                ('datetime', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Products_Orders',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.order')),
                ('product_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.product')),
            ],
        ),
        migrations.CreateModel(
            name='Files_Orders',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('files', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.files_for_individual_orders')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.order')),
            ],
        ),
        migrations.CreateModel(
            name='Emploee_Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('emploee_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.emploee')),
                ('order_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.order')),
            ],
        ),
        migrations.CreateModel(
            name='Clients_Reviews',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('client_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.client')),
                ('review_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.review')),
            ],
        ),
        migrations.CreateModel(
            name='Clients_Orders',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('client_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.client')),
                ('order_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.order')),
            ],
        ),
    ]
