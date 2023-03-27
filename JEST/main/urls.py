from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings

from . import main_page, history, contacts, catalog, product_page, cart, search, login

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
    path('add-to-cart', cart.add_to_cart),
    path('search', search.get_product_with_similarity_titles),
    path('sendmail', login.EmailSender),
    path('login', login.login)
]