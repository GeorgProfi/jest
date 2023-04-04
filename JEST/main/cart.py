from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db import connection
from .models import Product
import json
from . import dictfetchall as df
from .sessionlogic import gen_session
from django.conf import settings
from django.core.files.storage import FileSystemStorage
import os


def render_cart(request):
    gen_session(request)
    return render(request, 'main/cart.html')


def cart_product_info(request):
    data = []
    cart = json.loads(request.COOKIES['cart'].replace("'", '"'))
    cart_keys_set = set(cart.keys())
    product_id_set = []
    product_count_set = []
    for key in cart_keys_set:
        product_id_set.append(key.split('$')[0])
        product_count_set.append(cart[key])

    queryResult = Product.objects.raw(f"""
            SELECT id, title, photos, price
            FROM main_product
            WHERE id in ({','.join(product_id_set)})""")

    for el in queryResult:
        block_data = {
            'id': el.id,
            'title': el.title,
            'price': el.price,
            'image': str(el.photos['img1']),
        }
        data.append(block_data)

    return JsonResponse(
        {
            'count': f'{len(data)}',
            'data': f"{json.dumps(data)}"
        }
    )