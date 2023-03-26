from django.db import models

class DeliveryType(models.Model):
    delivery_type = models.CharField(max_length=50)


class PaymentMethod(models.Model):
    payment_method = models.CharField(max_length=50)


class Order(models.Model):
    sum = models.IntegerField()
    datetime = models.DateTimeField()
    address = models.CharField(max_length=100, null=True)
    delivery_type = models.ForeignKey(DeliveryType, on_delete=models.CASCADE)
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE)
    comment = models.CharField(max_length=500, null=True)


class Post(models.Model):
    info = models.CharField(max_length=50)


class Review(models.Model):
    content = models.CharField(max_length=300)
    datetime = models.DateTimeField()


class Emploee(models.Model):
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=50)
    is_active = models.BooleanField()
    post = models.ForeignKey(Post, on_delete=models.RESTRICT)


class MasterInfo(models.Model):
    emploee = models.OneToOneField(Emploee, primary_key=True, on_delete=models.RESTRICT)
    info = models.CharField(max_length=500)
    image = models.CharField(max_length=50)


class Client(models.Model):
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20)


class ClientReview(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)


class ClientOrder(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)


class EmploeeOrder(models.Model):
    emploee = models.ForeignKey(Emploee, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)


class Category(models.Model):
    category = models.CharField(max_length=50)


class Collection(models.Model):
    collection = models.CharField(max_length=50)


class Metal(models.Model):
    type = models.CharField(max_length=50)
    probe = models.IntegerField()


class Gem(models.Model):
    type = models.CharField(max_length=50)


class Product(models.Model):
    title = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    weight = models.FloatField()
    price = models.IntegerField()
    count = models.IntegerField(default=0)
    photos = models.JSONField()
    size = models.JSONField()
    is_active = models.BooleanField(default=False)
    description = models.CharField(max_length=300)


class ProductMetal(models.Model):
    metal = models.ForeignKey(Metal, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)


class ProductGem(models.Model):
    gem = models.ForeignKey(Gem, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    count = models.IntegerField()


class ProductOrder(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    count = models.IntegerField()


class FileForIndividualOrder(models.Model):
    file = models.CharField(max_length=50)


class ClienFile(models.Model):
    file = models.ForeignKey(FileForIndividualOrder, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)


class FileOrder(models.Model):
    file = models.ForeignKey(FileForIndividualOrder, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)


class History(models.Model):
    title = models.CharField(max_length=50)
    info = models.CharField(max_length=1000)
    image = models.JSONField()


class Common(models.Model):
    title = models.CharField(max_length=50)
    path = models.CharField(max_length=50)


class AboutUs(models.Model):
    title = models.CharField(max_length=50)
    text = models.CharField(max_length=1000)
    image = models.CharField(max_length=50)


class Faqs(models.Model):
    question = models.CharField(max_length=200)
    answer = models.CharField(max_length=200)





