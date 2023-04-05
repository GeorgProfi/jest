from django.http import JsonResponse
from django.db import connection
from . import dictfetchall as df
from datetime import datetime
from .sessionlogic import gen_session
from django.db import connection
from django.conf import settings
from .models import DeliveryType, PaymentMethod
import json
from django.http import JsonResponse, HttpResponse
from django.core.files.storage import FileSystemStorage


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
                insert into main_order(sum, datetime, address, comment, delivery_type_id, payment_method_id, status_id)
                values(
                    {orderData['sum']},
                    '{datetime.now()}',
                    '{orderData['address']}',
                    '{orderData['comment']}',
                    {orderData['delivery_type_id']},
                    {orderData['payment_method_id']},
                    3
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
        id_and_email = df.dictfetchall(cursor)[0]
        client_id = id_and_email['id']
        client_email = id_and_email['email']
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
        files = request.FILES.getlist('files')
        countFiles = len(files)
        if countFiles > settings.ALLOWED_NUMBER_OF_FILES:
            return HttpResponse({'code': 23})
        for i in range(countFiles):
            if files[i].name.split('.')[-1] not in settings.ALLOWED_FILE_FORMATS:
                if files[i].size > settings.ALLOWED_FILE_SIZE:
                    return HttpResponse({'code': 23})
        fileSS = FileSystemStorage(location=f'{settings.MEDIA_ROOT}/{client_email}/')
        for i in range(countFiles):
            fileSS.save(files[i].name, files[i])
            cursor.execute(
                f"""
                        insert into main_fileforindividualorder(file)
                        values('\{settings.MEDIA_ROOT}\{client_email}\{files[i].name}\');
                        SELECT currval(pg_get_serial_sequence('main_fileforindividualorder','id')) as lid;
                        insert into main_fileorder(order_id, file_id)
                        values(lid, {order_id});
                    """
            )
    return JsonResponse({'code': 200})







