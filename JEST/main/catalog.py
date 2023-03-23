from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from . import dictfetchall as df
from .models import Category

import json


def render_catalog(request):
    return render(request, 'main/catalog.html')


def products(request):
    url_parameters = list(request.GET.keys())
    count = request.GET['count']
    already_in_page = request.GET['already_in_page']
    query = """
        select distinct on (id)
        id, title, price, photos, size, weight, description, category, collection, gems, metals from products
        cross join lateral jsonb_array_elements (
        case
        when to_jsonb(metals) is null then '[{}]'
        else to_jsonb(metals) end
        ) as filter1
        cross join lateral jsonb_array_elements (
        case
        when to_jsonb(gems) is null then '[{}]'
        else to_jsonb(gems) end
        ) as filter2
        where products.id is not null"""
    if 'probes' in url_parameters:
        probe = request.GET['probes'].split()
        query += f" and (filter1->>'probe' = '{probe[0]}'"
        for i in range(1, len(probe)):
            query += f" or filter1->>'probe' ='{probe[i]}'"
        query += ')'

    if 'probes_and_metals' in url_parameters:
        metals = request.GET['probes_and_metals'].split()
        query += f" and (filter1->>'title' = '{metals[0]}'"
        for i in range(1, len(metals)):
            query += f" or filter1->>'title' ='{metals[i]}'"
        query += ')'

    if 'gems' in url_parameters:
        gems = request.GET['gems'].split()
        query += f" and (filter2->>'title' = '{gems[0]}'"
        for i in range(1, len(gems)):
            query += f" or filter2->>'title' ='{gems[i]}'"
        query += ')'


    if 'sizes_and_categories' in url_parameters:
        category = request.GET['sizes_and_categories'].split()
        query += f" and (products.category = '{category[0]}'"
        for i in range(1, len(category)):
            query += f" or products.category = '{category[i]}'"
        query += ')'
    if 'min_price' in url_parameters:
        min_price = request.GET['min_price']
        query += f" and products.price >= {min_price}"
    if 'max_price' in url_parameters:
        max_price = request.GET['max_price']
        query += f" and products.price <= {max_price}"
    if 'collections' in url_parameters:
        collection = request.GET['collections'].split()
        query += f" and (products.collection = '{collection[0]}'"
        for i in range(1, len(collection)):
            query += f" or products.collection = '{collection[i]}'"
        query += ')'


    if 'title' in url_parameters:
        title = request.GET['title']
        query += f" and products.title = '{title}'"

    query += f"""
    order by products.id
    limit {count}
    offset {already_in_page};
    """
    print(query)

    with connection.cursor() as cursor:
        data = []
        cursor.execute(query)
        rows = df.dictfetchall(cursor)
        print(rows)
        for row in rows:
            block_data = {
                'id': row['id'],
                'title': row['title'],
                'price': row['price'],
                'image': str(json.loads(row['photos'])['img1']),
                'material': row['metals'],
                'size': row['size'],
                'gems': row['gems'],
                'mass': row['weight'],
            }
            data.append(block_data)
    return JsonResponse(
        {
            'count': f"{len(data)}",
            'data': f"{json.dumps(data)}"
        }
    )


def categories(request):
    data = []
    for el in Category.objects.all():
        block_data = {
            'id': el.id,
            'title': el.title,
        }
        data.append(block_data)
    return JsonResponse(
        {
            'count': f'{len(data)}',
            'data': f"{json.dumps(data)}"
        }
    )


def filters(request):
    with connection.cursor() as cursor:
        cursor.execute('select * from filters;')
        data = df.dictfetchall(cursor)[0]
        return JsonResponse(
            {
                'count': f'{len(data)}',
                'data': {
                    'sizes_and_categories': data['sizes_and_categories'],
                    'collections': data['collections'],
                    'probes_and_metals': data['probes_and_metals'],
                    'gems': data['gems'],
                    'max_price': data['max_price']
                }
            }
        )