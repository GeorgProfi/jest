from django.shortcuts import render
from django.http import JsonResponse
import json
from django.db import connection
from . import dictfetchall as df
from .sessionlogic import gen_session


def render_contacts(request):
    gen_session(request)
    return render(request, 'main/contact.html')


def get_masters(request):
    with connection.cursor() as cursor:
        data = []
        cursor.execute("select * from master;")
        rows = df.dictfetchall(cursor)
        for row in rows:
            block_data = {
                'id': row['id'],
                'name': row['name'],
                "surname": row['surname'],
                "post": row['post'],
                "text": row['info'],
                "image": row['image'],
            }
            data.append(block_data)
        print(data)
        return JsonResponse(
            {
                'count': f"{len(data)}",
                'data': f"{json.dumps(data)}"
            }
        )