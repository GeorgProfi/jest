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


def add_to_cart(request):
    response = HttpResponse('{}')
    if ('id' in request.GET) and ('count' in request.GET):
        product_id = request.GET['id']
        count_product = request.GET['count']

        if 'cart' not in request.COOKIES:
            cart = {product_id: count_product}
            response.set_cookie('cart', cart)
        else:
            print(request.COOKIES.get('cart'))
            print(type(request.COOKIES.get('cart')))
            cart = json.loads(request.COOKIES['cart'].replace("'", '"'))

            if f'{product_id}' in cart:
                cart[product_id] = int(cart[product_id]) + int(count_product)
            else:
                cart[product_id] = count_product
            response.set_cookie('cart', cart)

        if int(cart[product_id]) <= 0:
            cart.pop(product_id)
            response.set_cookie('cart', cart)

    return response


def add_files(request):
    files = request.FILES.getlist('files')
    countFiles = len(files)
    if countFiles > settings.ALLOWED_NUMBER_OF_FILES:
        return HttpResponse({'code': 23})
    email = request.GET['email']
    for i in range(countFiles):
        if files[i].name.split('.')[-1] not in settings.ALLOWED_FILE_FORMATS:
            if files[i].size > settings.ALLOWED_FILE_SIZE:
                return HttpResponse({'code': 23})
    fileSS = FileSystemStorage(location=f'{settings.MEDIA_ROOT}/{email}/')
    for i in range(countFiles):
        fileSS.save(files[i].name, files[i])
    return JsonResponse({'code': 200})


def delete_from_cart(request):
    response = JsonResponse({'code': 200})
    if 'id' in request.GET:
        product_id = request.GET['id']
        if 'cart' in request.COOKIES:
            cart = json.loads(request.COOKIES['cart'].replace("'", '"'))
            cart.pop(product_id)
            response.set_cookie('cart', cart)
    return response


def cart_product_info(request):
    data = []
    cart = json.loads(request.COOKIES['cart'].replace("'", '"'))
    product_id_list = set(cart.keys())

    for el in Product.objects.raw('SELECT id, title, photos, price FROM main_product'):
        block_data = {'id': el.id,
                      'title': el.title,
                      'price': el.price,
                      'image': str(json.loads(el.photos)['img1'])
                      }
        data.append(block_data)
    return JsonResponse(
        {
            'count': f'{len(data)}',
            'data': f"{json.dumps(data)}"
        }
    )