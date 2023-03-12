from django.shortcuts import render
from .models import AboutUs
from django.http import JsonResponse
import json
from django.db import connection
import datetime


def history(request):
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





