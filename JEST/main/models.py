from django.db import models


class Order(models.Model):
    sum = models.IntegerField()
    datetime = models.DateTimeField()


class Category(models.Model):
    category = models.CharField(max_length=30)


class Product(models.Model):
    title = models.CharField(max_length=30)
    category = models.ForeignKey(Category, on_delete=models.RESTRICT)
    weight = models.FloatField()
    probe = models.CharField(max_length=30)
    count = models.IntegerField(default=0)
    price = models.IntegerField()
    gems = models.JSONField()
    photos = models.JSONField()
    metals = models.CharField(max_length=30)
    is_active = models.BooleanField(default=False)


class Review(models.Model):
    content = models.CharField(max_length=200)
    datetime = models.DateTimeField()

class Client(models.Model):
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    email = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=20)

class Emploee(models.Model):
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    email = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=20)
    info = models.CharField(max_length=1000)


class Clients_Reviews(models.Model):
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE)
    review_id = models.ForeignKey(Review, on_delete=models.CASCADE)
    
    
class Products_Orders(models.Model):
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)

class Clients_Orders(models.Model):
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE)
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)

class Emploee_Order(models.Model):
    emploee_id = models.ForeignKey(Emploee, on_delete=models.CASCADE)
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)


class Collection(models.Model):
    collection = models.CharField(max_length=30)


class Files_for_individual_orders(models.Model):
    files = models.JSONField()
    comment = models.CharField(max_length=200)


class Files_Orders(models.Model):
    files = models.ForeignKey(Files_for_individual_orders, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

class About (models.Model):
     title = models.CharField(max_length=20)
     text = models.CharField(max_length=200)
     image = models.CharField(max_length=100)


class Faqs(models.Model):
    question = models.CharField(max_length=200)
    answer = models.CharField(max_length=200)