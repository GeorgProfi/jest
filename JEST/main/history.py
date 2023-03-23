from django.shortcuts import render
from django.http import JsonResponse
import json
from .models import History


def render_history(request):
    return render(request, 'main/history.html') #изменить шаблон 


def get_history(request):
    data = []
    for el in History.objects.all():
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





