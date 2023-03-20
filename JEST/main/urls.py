from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings

from . import main_page, history, contacts, catalog, login

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
    path('mailsend', login.EmailSender),
]