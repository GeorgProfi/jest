from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from . import dictfetchall as df
from .models import Category


def render_catalog(request):
    return render(request, 'main/index.html') #зменить шаблон


def
