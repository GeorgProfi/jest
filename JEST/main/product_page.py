from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from . import dictfetchall as df
import json
from .sessionlogic import gen_session

def render_product_page(request, product_id):
    gen_session(request)
    return render(request, 'main/product_page.html')  # изменить шаблон


def product_info(request):
    if 'id' in request.GET:
        product_id = request.GET['id']
        with connection.cursor() as cursor:
            cursor.execute(f'select * from products where id = {product_id}')
            row = df.dictfetchall(cursor)[0]

            data = {
                'id': row['id'],
                'title': row['title'],
                'description': row['description'],
                'price': row['price'],
                'images': {
                    'image_1': str(json.loads(row['photos'])['img1']),
                    'image_2': str(json.loads(row['photos'])['img2']),
                    'image_3': str(json.loads(row['photos'])['img3'])
                },
                'material': row['metals'],
                'size': row['size'],
                'gems': row['gems'],
                'mass': row['weight']
            }
    else:
        data = {}
    return JsonResponse(
        data
    )
