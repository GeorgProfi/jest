from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from . import dictfetchall as df

import json
#from .models import




def render_catalog(request):
    return render(request, 'main/index.html') #изменить шаблон


def products(request):
    url_parameters = list(request.GET.keys())
    count = request.GET['count']
    already_in_page = request.GET['already_in_page']
    if 'category' in url_parameters:
        category = request.GET['category']
    if 'min_price' in url_parameters:
        min_price = request.GET['min_price']
    if 'max_price' in url_parameters:
        max_price = request.GET['max_price']
    if 'collection' in url_parameters:
        collection = request.GET['collection']
    if 'probe' in url_parameters:
        probe = request.GET['probe']
    if 'size' in url_parameters:
        size = request.GET['size']

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
