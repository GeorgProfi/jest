from django.contrib import admin
from django.urls import path
from django.conf import settings

from . import views

urlpatterns = [

    path('admin/',admin.site.urls),
    path('main/',views.render_main)

]