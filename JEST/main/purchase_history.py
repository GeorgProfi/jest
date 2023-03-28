from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from . import dictfetchall as df
from datetime import datetime
from .sessionlogic import gen_session
import json


def render_purchase_history(request):
    gen_session(request)
    return render(request, 'main/index.html') # изменить шаблон


def purchases(request):
    uuid = request.session['UUID']
    # uuid_s = uuid_status[uuid][0] добавить после разработки uuid_status
    # uuid_t = uuid_status[uuid][1] добавить после разработки uuid_status
    if True:  # (uuid_t > datetime.now()) and (uuid_s = '0'): добавить после разработки uuid_status
        query = f"""
        select * from purchases
        where uuid = {uuid};
        """
        with connection.cursor() as cursor:
            data = []
            cursor.execute(query)
            rows = df.dictfetchall(cursor)
            for row in rows:
                block_data = {
                    'uuid': row['uuid'],
                    'email': row['email'],
                    'order_id': row['order_id'],
                    'total_sum': row['total_sum'],
                    'datetime': row['datetime'],
                    'delivery_type': row['delivery_type'],
                    'payment_method': row['payment_method'],
                    'count_products': row['count_products'],  # в бидешечке изменить способ получения ага да
                    'products': row['products'],
                    'count_files': row['count_files'],  # в бидешечке изменить способ получения ага да
                    'files': row['files'],
                }
                data.append(block_data)
    else:
        data = []
    return JsonResponse(
        {
            'count': f"{len(data)}",
            'data': f"{json.dumps(data)}"
        }
    )