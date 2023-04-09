from django.shortcuts import render


def error403(request, exception):
    return render(request, 'access_denied.html')


def error404(request, exception):
    return render(request, 'page_not_found.html')


def error500(request):
    return render(request, 'page_not_found.html')