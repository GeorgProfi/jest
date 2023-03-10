from django.shortcuts import render
from .models import Emploee, About,Faqs
from django.http import JsonResponse
import json


def render_main (request):
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
    block_data = {
        'title':'',
        'text':'',
        'image':''
            }
    data = []
    for el in AboutUs.objects.all():
        block_data = {'title':el.title,
                'text': el.text,
                'image':el.image
                }
        data.append(json)

    return JsonResponse(
        {
            'count': f'{len(data)}',
           'data': f"{json.dumps(data)}"
        }
    )

def faq(request):
    block_data = {
        'question':'',
        'answer':''
            }
    data = []
    for el in Faqs.objects.all():
        block_data = {'question':el.question,
                'answer': el.answer,
                }
        data.append(block_data)
    print ()

    return JsonResponse(
        {
            'count': f'{len(data)}',
           'data': f"{json.dumps(data)}"
        }
    )

# Create your views here.
