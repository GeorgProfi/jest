from django.shortcuts import render
from django.http import JsonResponse
import json
from django.db import connection


def dictfetchall(cursor):
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]


def get_masters(request):
    with connection.cursor() as cursor:
        data = []
        cursor.execute("select * from master;")
        rows = dictfetchall(cursor)
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