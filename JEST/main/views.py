from django.shortcuts import render
from .models import Emploee
from django.http import JsonResponse



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

# Create your views here.
