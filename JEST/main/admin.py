from django.contrib import admin
from .models import Product


class productAdmin(admin.ModelAdmin):
    pass

admin.site.register(Product, productAdmin)