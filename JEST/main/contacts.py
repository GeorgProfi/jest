from django.shortcuts import render
from django.http import JsonResponse
import json
from django.db import connection
from . import dictfetchall as df
from .sessionlogic import gen_session



def render_contacts(request):
    gen_session(request)
    return render(request, 'main/index.html') #изменить шаблон


def get_masters(request):
    with connection.cursor() as cursor:
        data = []
        cursor.execute("select * from master;")
        rows = df.dictfetchall(cursor)
        for row in rows:
            block_data = {
                'name': f"{row['name']}",
                "surname": f"{row['surname']}",
                "email": f"{row['email']}",
                "text": f"{row['info']}",
                "image": f"{row['image']}"
            }
            data.append(block_data)
        return JsonResponse(
            {
                'count': f"{len(data)}",
                'data': f"{json.dumps(data)}"
            }
        )