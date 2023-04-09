from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from . import dictfetchall as df
from datetime import datetime
from .sessionlogic import gen_session
from django.conf import settings
import json


def purchases(request):


    with connection.cursor() as cursor:
        cursor.execute(
            f"""
                select main_client.email from
                main_client join main_emailuuid on main_client.email = main_emailuuid.email
                where uuid = '{request.session.session_key}';
            """
        )
        email = df.dictfetchall(cursor)[0]['email']
        query = f"""
            select * from purchases
            where email = '{email}';
            """
        data = []
        cursor.execute(query)
        rows = df.dictfetchall(cursor)
        for row in rows:
            block_data = {
                'email': row['email'],
                'order_id': row['order_id'],
                'status_id': row['status_id'],
                'order_status': row['order_status'],
                'total_sum': row['total_sum'],
                'datetime': str(row['datetime']),
                'order_address': row['order_address'],
                'delivery_type': row['delivery_type'],
                'payment_method': row['payment_method'],
                'count_products': row['count_products'],
                'products': row['products'],
                'count_files': row['count_files'],
                'files': row['files'],
            }
            data.append(block_data)
    return JsonResponse(
        {
            'count': f"{len(data)}",
            'data': f"{json.dumps(data)}"
        }
    )