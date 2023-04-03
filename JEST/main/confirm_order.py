from django.http import JsonResponse
from django.db import connection
from . import dictfetchall as df
from datetime import datetime
from .sessionlogic import gen_session
from django.db import connection
from django.conf import settings
from .models import DeliveryType, PaymentMethod
import json


def getDeliveryTypes(request):
    data = []
    for el in DeliveryType.objects.all():
        block_data = {
            'id': el.id,
            'delivery_type': el.delivery_type
        }
        data.append(block_data)
    return JsonResponse(
        {
            'count': f'{len(data)}',
            'data': f"{json.dumps(data)}"
        }
    )


def getPaymentMethods(request):
    data = []
    for el in PaymentMethod.objects.all():
        block_data = {
            'id': el.id,
            'payment_method': el.payment_method
        }
        data.append(block_data)
    return JsonResponse(
        {
            'count': f'{len(data)}',
            'data': f"{json.dumps(data)}"
        }
    )


def confirm_order(request):
    orderData = json.loads(request.body)
    gen_session(request)
    cart = json.loads(request.COOKIES['cart'])
    cart_keys = cart.keys()
    print(cart)

    with connection.cursor() as cursor:
        cursor.execute(
            f"""
                insert into main_order(sum, datetime, address, comment, delivery_type_id, payment_method_id)
                values(
                    {orderData['sum']},
                    '{datetime.now()}',
                    '{orderData['address']}',
                    '{orderData['comment']}',
                    {orderData['delivery_type_id']},
                    {orderData['payment_method_id']}
                );
                SELECT currval(pg_get_serial_sequence('main_order','id')) as lid;
            """
        )
        order_id = df.dictfetchall(cursor)[0]['lid']
        cursor.execute(
            f"""
                select id, email from main_client
                where uuid = '{request.session.session_key}';
            """
        )
        client_id = df.dictfetchall(cursor)[0]['id']
        cursor.execute(
            f"""
                update main_client 
                set 
                    name = '{orderData['name']}',
                    surname = '{orderData['surname']}',
                    phone_number = '{orderData['phone_number']}'
                where id = {client_id};
            """
            )
        cursor.execute(
            f"""
                insert into main_clientorder(client_id, order_id)
                values(
                    {client_id},
                    {order_id}
                );
            """
        )

        query = ""
        for key in cart_keys:
            query += f"""
                insert into main_productorder(count, order_id, product_id, size) 
                values({cart[key]}, {order_id}, {key.split('$')[0]}, {key.split('$')[1]});
            """
        cursor.execute(query)
        cursor.execute(
            f"""
                insert into main_statusorder(order_id, status_id)
                values(
                    {order_id},
                    3
                );
            """
        )
    return JsonResponse({'code': 200})






