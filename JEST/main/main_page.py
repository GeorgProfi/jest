from django.shortcuts import render
from .models import Emploee, AboutUs, Faqs
from django.http import JsonResponse
import json
from django.db import connection
import datetime


def render_main(request):
    return render(request, 'main/index.html')


def api_test(request):
    name_for_filter = request.GET.get('name')
    data = []
    for el in Emploee.objects.raw(
            "select * from main_emploee\n"
            f"where name = '{name_for_filter}'"):
        data.append(el)
    return JsonResponse(
        {
            'emploee': f'{data}'
        }
    )


def why_us(request):
    data = []
    for el in AboutUs.objects.all():
        block_data = {'title': el.title,
                      'text': el.text,
                      'image': el.image
                      }
        data.append(block_data)
    return JsonResponse(
        {
            'count': f'{len(data)}',
            'data': f"{json.dumps(data)}"
        }
    )


def reviews(request):
    count = request.GET.get('count')
    data = []
    with connection.cursor() as cursor:
        cursor.execute("select * from last_reviews;")
        row = cursor.fetchall()
        for i in range(int(count)):
            block_data = {
                'name': f'{row[i][1]} {row[i][2]}',
                "review_text": f"{row[i][4]}",
                "date": f"{row[i][5].date()}"
            }
            data.append(block_data)
        return JsonResponse(
            {
                'count': f'{len(data)}',
                'data': f"{json.dumps(data)}"
            }
        )


def faq(request):
    data = []
    for el in Faqs.objects.all():
        block_data = {'question': el.question,
                      'answer': el.answer,
                      }
        data.append(block_data)

    return JsonResponse(
        {
            'count': f'{len(data)}',
            'data': f"{json.dumps(data)}"
        }
    )


def reviews(request):
    count = request.GET.get('count')
    data = []
    with connection.cursor() as cursor:
        cursor.execute("select * from last_reviews;")
        row = cursor.fetchall()
        for i in range(int(count)):
            block_data = {
                'name': f'{row[i][1]} {row[i][2]}',
                "review_text": f"{row[i][4]}",
                "date": f"{row[i][5].date()}"
            }
            data.append(block_data)
        return JsonResponse(
            {
                'count': f'{len(data)}',
                'data': f"{json.dumps(data)}"
            }
        )



def most_popular(request):
    count = request.GET.get('count')
    data = []
    with connection.cursor() as cursor:
        cursor.execute("select * from most_popular_product;")

        for i in range(int(count)):
            row = cursor.fetchone()
            block_data = {
	'product-name':f'{row[2]}',
	'product-price':f'{row[3]}' ,
	'product-image':f'{row[4]}'
}

            data.append(block_data)
        return JsonResponse(
            {
                'count': f'{len(data)}',
                'data': f"{json.dumps(data)}"
            }
        )

# Create your views here.
