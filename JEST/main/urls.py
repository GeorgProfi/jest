from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings

from . import main_page, history, contacts, catalog, login, cart, product_page, search, purchase_history, confirm_order

admin.site.site_header = f'Arts & Crafts\nПанель Управления'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', main_page.render_main),
    path('why-us/', main_page.why_us),
    path('faq/', main_page.faq),
    path('reviews', main_page.reviews),
    path('most-popular-products', main_page.most_popular),
    path('get_history', history.get_history),
    path('history', history.render_history),
    path('masters', contacts.get_masters),
    path('contacts', contacts.render_contacts),
    path('catalog', catalog.render_catalog),
    path('products', catalog.products),
    path('categories', catalog.categories),
    path('filters', catalog.filters),
    path('product_page/<int:product_id>/', product_page.render_product_page),
    path('product_info', product_page.product_info),
    path('cart', cart.render_cart),
    path('search', search.get_product_with_similarity_titles),
    path('purchases', purchase_history.purchases),
    path('sendmail', login.EmailSender),
    path('login', login.login),
    path('account', login.account_page_renderer),
    path('cart-product-info', cart.cart_product_info),
    path('confirm_order', confirm_order.confirm_order),
    path('get-payment-methods', confirm_order.getPaymentMethods),
    path('get-delivery-types', confirm_order.getDeliveryTypes)
]
