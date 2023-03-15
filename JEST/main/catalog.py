from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from . import dictfetchall as df

import json




def render_catalog(request):
    return render(request, 'main/index.html') #изменить шаблон


def products(request):
    url_parameters = list(request.GET.keys())
    count = request.GET['count']
    already_in_page = request.GET['already_in_page']
    query = f"""
        select * from products
        where products.id is not null
    """

    if 'category' in url_parameters:
        category = request.GET['category'].split()
        for el in category:
            query += f" and products.category = '{el}'"
    if 'min_price' in url_parameters:
        min_price = request.GET['min_price']
        query += f" and products.price >= {min_price}"
    if 'max_price' in url_parameters:
        max_price = request.GET['max_price']
        query += f" and products.price <= {max_price}"
    if 'collection' in url_parameters:
        collection = request.GET['collection'].split()
        for el in collection:
            query += f" and products.collection = '{el}'"
    if 'probe' in url_parameters:
        probe = request.GET['probe'].split()
        for el in probe:
            query += f" and products.probe = {el}"
    if 'title' in url_parameters:
        title = request.GET['title']
        query += f" and products.title = '{title}'"

    query += f"""
        order by products.id
        limit {count} 
        offset {already_in_page};
    """

    with connection.cursor() as cursor:
        data = []
        cursor.execute(query)
        rows = df.dictfetchall(cursor)
        for row in rows:
            block_data = {
                'id'       : row['id'],
                'title'    : row['title'],
                'price'    : row['price'],
                'image'    : str(json.loads(row['photos'])['img1']),
                'material' : row['metals'],
                'size'     : row['size'],
                'gems'     : row['gems'],
                'mass'     : row['weight'],
            }
            data.append(block_data)
    return JsonResponse(
        {
            'count': f"{len(data)}",
            'data': f"{json.dumps(data)}"
        }
    )
