from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db import connection
from . import dictfetchall as df


def render_cart(request):
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
            cart = eval(request.COOKIES['cart'])

            if f'{product_id}' in cart:
                cart[product_id] = int(cart[product_id]) + int(count_product)
            else:
                cart[product_id] = count_product
            response.set_cookie('cart', cart)

        if int(cart[product_id]) <= 0:
            cart.pop(product_id)
            response.set_cookie('cart', cart)

    return response


def delete_from_cart(request):
    response = HttpResponse('{}')
    if 'id' in request.GET:
        product_id = request.GET['id']
        if 'cart' in request.COOKIES:
            cart = eval(request.COOKIES['cart'])
            cart.pop(product_id)
            response.set_cookie('cart', cart)

    return response
