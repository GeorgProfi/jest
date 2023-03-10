from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings

from . import views

urlpatterns = [

    path('admin/', admin.site.urls),
    path('', views.render_main),
    path('why-us/', views.why_us),
    path('faq', views.faq)

]