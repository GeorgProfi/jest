from django.contrib import admin
from django.db.models import Q
from django.utils.html import format_html

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
    list_display = ['id', 'file', 'link']
    change_list_template = 'admin/change_file.html'

    def link(self, obj):
        idFile = obj.id
        try:
            fileItself = FileOrder.objects.filter(file=idFile)
            parts = fileItself[0].file.file.split('\\')

            from django.utils.html import format_html
            return format_html(
                "<a href='%s'>%s</a>" % (f'/files-orders-a/{parts[len(parts) - 2]}/{parts[len(parts) - 1]}',
                                         f"Download"
                                         ))

        except IndexError:
            return ''

    link.allow_tags = True
    link.mark_safe = True

    def change_view(self, request, object_id, form_url="", extra_context={}):
        fileItself = FileOrder.objects.filter(file=object_id)
        parts = fileItself[0].file.file.split('\\')

        prikol = format_html(
            "<a href='%s'>%s</a>" % (f'/files-orders-a/{parts[len(parts) - 2]}/{parts[len(parts) - 1]}',
                                     f"Download"
                                     ))
        extra_context['Link'] = prikol
        return super().change_view(
            request,
            object_id,
            form_url,
            extra_context=extra_context,
        )




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


class InputFilter(admin.SimpleListFilter):
    template = 'admin/input_filter.html'

    def lookups(self, request, model_admin):
        return ((),)

    def choices(self, changelist):
        all_choice = next(super().choices(changelist))
        all_choice['query_parts'] = (
            (k, v)
            for k, v in changelist.get_filters_params().items()
            if k != self.parameter_name
        )
        yield all_choice


class UIDFilter(InputFilter):
    parameter_name = 'id'
    title = ('ID')

    def queryset(self, request, queryset):
        if self.value() is not None:
            id = self.value()

            return queryset.filter(
                Q(id=id)
            )


class filesOrderInline(admin.TabularInline):
    model = FileOrder

class productOrderInline(admin.TabularInline):
    model = ProductOrder


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_filter = (UIDFilter, "status", "delivery_type")
    list_display = ("id", "datetime", "client_name", "client_phone", "address")
    inlines = [filesOrderInline, productOrderInline]

    def __str__(self):
        return self.id

    def client_name(self, obj):
        idOrder = obj.id
        try:
            idClientorder = ClientOrder.objects.filter(order=idOrder)
            from django.utils.html import format_html
            return format_html("<a href='%s'>%s</a>" % (f'/admin/main/client/{idClientorder[0].client.id}/change',
                                                        f"{idClientorder[0].client.name} {idClientorder[0].client.surname}"
                                                        ))

        except IndexError:
            return ''

    client_name.allow_tags = True
    client_name.mark_safe = True

    def client_phone(self, obj):
        idOrder = obj.id
        try:
            idClientorder = ClientOrder.objects.filter(order=idOrder)
            return f'{idClientorder[0].client.phone_number}'
        except IndexError:
            return ''
