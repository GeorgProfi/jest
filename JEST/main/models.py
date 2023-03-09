from django.db import models


class DeliveryType(models.Model):
    delivery_type = models.CharField(max_length=30)

class PaymentMethod(models.Model):
    payment_method = models.CharField(max_length=30)

class Order(models.Model):
    sum = models.IntegerField()
    datetime = models.DateTimeField()
    address = models.CharField(max_length=100)
    delivery_type = models.ForeignKey(DeliveryType, on_delete=models.CASCADE)
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE)
    comment = models.CharField(max_length=500)

class Post(models.Model):
    info = models.CharField(max_length=300)
    photo = models.CharField(max_length=30)

class Review(models.Model):
    content = models.CharField(max_length=300)
    datetime = models.DateTimeField()



class Emploee(models.Model):
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    email = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=20)
    is_active = models.BooleanField()
    post_id = models.ForeignKey(Post, on_delete=models.RESTRICT)

class MasterInfo(models.Model):
    emploee_id = models.OneToOneField(Emploee, primary_key=True, on_delete=models.RESTRICT)
    info = models.CharField(max_length=500)
    photo = models.CharField(max_length=30)

class Client(models.Model):
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    email = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=20)

class ClientReview(models.Model):
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE)
    review_id = models.ForeignKey(Review, on_delete=models.CASCADE)

class ClientOrder(models.Model):
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE)
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)

class EmploeeOrder(models.Model):
    emploee_id = models.ForeignKey(Emploee, on_delete=models.CASCADE)
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)


class Category(models.Model):
    category = models.CharField(max_length=30)

class Collection(models.Model):
    collection = models.CharField(max_length=30)

class Metal(models.Model):
    type = models.CharField(max_length=30)
    probe = models.IntegerField()

class Gem(models.Model):
    type = models.CharField(max_length=30)
    weight = models.IntegerField()

class Product(models.Model):
    title = models.CharField(max_length=30)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    weight = models.IntegerField()
    price = models.IntegerField()
    count = models.IntegerField(default=0)
    photos = models.JSONField()
    is_active = models.BooleanField(default=False)
    description = models.CharField(max_length=300)


class ProductMetal(models.Model):
    metal_id = models.ForeignKey(Metal, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)

class ProductGem(models.Model):
    gem_id = models.ForeignKey(Gem, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)

class ProductOder(models.Model):
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    count = models.IntegerField()

class FileForIndividualOrder(models.Model):
    file = models.CharField(max_length=30)


class ClienFile(models.Model):
    file_id = models.ForeignKey(FileForIndividualOrder, on_delete=models.CASCADE)
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE)

class FileOrder(models.Model):
    file_id = models.ForeignKey(FileForIndividualOrder, on_delete=models.CASCADE)
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)



class History(models.Model):
    title = models.CharField(max_length=30)
    info = models.CharField(max_length=500)
    photo = models.CharField(max_length=30)
class Common(models.Model):
    title = models.CharField(max_length=30)
    path = models.CharField(max_length=30)

class AboutUs(models.Model):
    title = models.CharField(max_length=30)
    info = models.CharField(max_length=500)
    photo = models.CharField(max_length=30)



