from django.contrib import admin
from django.urls import path, re_path
from django.conf import settings

from . import views

urlpatterns = [

    path('admin/', admin.site.urls),
    path('', views.render_main),
    path('api_test/', views.api_test),

]