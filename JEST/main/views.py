from django.shortcuts import render


def render_main (request):
    return render(request, 'main/index.html')


# Create your views here.
