from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings

from . import main_page, history

urlpatterns = [

    path('admin/', admin.site.urls),
    path('', main_page.render_main),
    path('why-us/', main_page.why_us),
    path('faq', main_page.faq),
    path('reviews', main_page.reviews),
    path('history', history.history),
    path('most-popular-products',main_page.most_popular)
]