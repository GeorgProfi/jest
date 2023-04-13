from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.core.files.storage import FileSystemStorage
from django.db import connection
from django.shortcuts import render
from .login import superusers_emails, staff_email

from . import dictfetchall as df
from JEST import settings


def get_file(request, email, path):
    query = f"""
        select main_client.email from
        main_client join main_emailuuid on main_client.email = main_emailuuid.email
        where uuid = '{request.session.session_key}';
        """
    with connection.cursor() as cursor:
        data = []
        cursor.execute(query)
        rows = df.dictfetchall(cursor)
    try:
        id_and_email = rows[0]
        client_email = id_and_email['email']
    except Exception:
        client_email = ''
    if email == client_email:
        try:
            with open(f'{settings.MEDIA_ROOT}\{client_email}\{path}', 'rb') as f:
                file_data = f.read()
            response = HttpResponse(file_data)
            response['Content-Disposition'] = f'attachment; filename="{path}"'
            return response
        except Exception:
            return HttpResponseNotFound("Файл не найден")
    else:
        return render(request, 'access_denied.html')

def get_file_admin(request, email, path):
    try:
        superUserEmail = request.user.email
        for i in superusers_emails:
            if superUserEmail == i[0]:
                try:
                    with open(f'{settings.MEDIA_ROOT}\{email}\{path}', 'rb') as f:
                        file_data = f.read()
                    response = HttpResponse(file_data)
                    response['Content-Disposition'] = f'attachment; filename="{path}"'
                    return response
                except Exception:
                    return HttpResponseNotFound("Файл не найден")
        return render(request, 'access_denied.html')
    except AttributeError:
        return render(request, 'access_denied.html')
