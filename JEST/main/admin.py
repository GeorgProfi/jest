from django.contrib import admin
from .models import *


class productAdmin(admin.ModelAdmin):
    pass
admin.site.register(Product, productAdmin)

class CategoryAdmin(admin.ModelAdmin):
    pass
admin.site.register(Category, CategoryAdmin)

class metalAdmin(admin.ModelAdmin):
    pass
admin.site.register(Metal, metalAdmin)

class CollectionAdmin(admin.ModelAdmin):
    pass
admin.site.register(Collection, CollectionAdmin)

class CommonAdmin(admin.ModelAdmin):
    pass

admin.site.register(Common, CommonAdmin)
class GemAdmin(admin.ModelAdmin):
    pass

admin.site.register(Gem, GemAdmin)
class FaqsAdmin(admin.ModelAdmin):
    pass

admin.site.register(Faqs, FaqsAdmin)

class FileAdmin(admin.ModelAdmin):
    pass
admin.site.register(FileForIndividualOrder, FileAdmin)

class HistoryAdmin(admin.ModelAdmin):
    pass

admin.site.register(History, HistoryAdmin)

class DeliveryAdmin(admin.ModelAdmin):
    pass
admin.site.register(DeliveryType, DeliveryAdmin)

class AboutUsAdmin(admin.ModelAdmin):
    pass
admin.site.register(AboutUs, AboutUsAdmin)

class PaymentMethodAdmin(admin.ModelAdmin):
    pass
admin.site.register(PaymentMethod, PaymentMethodAdmin)

class StatusAdmin(admin.ModelAdmin):
    pass
admin.site.register(Status, StatusAdmin)



class clienorderinline(admin.TabularInline):

    model = ClientOrder

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    inlines = [clienorderinline]

from django.urls import reverse
from django.utils.http import urlencode
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    #fields = ['sum','datetime','address','delivery_type','payment_method','comment','client_object']
    list_display = ("datetime", "address", "client_name")
    def client_name(self, obj):
        idOrder= obj.id
        idClientorder = ClientOrder.objects.filter(order = idOrder)
        return f'{idClientorder[0].client.name} {idClientorder[0].client.surname}'

    def client_object(self, obj):
        self.idOrder= obj.id
        self.idClientorder = ClientOrder.objects.filter(order = self.idOrder)
        return self.isClientorder