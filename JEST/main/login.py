import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core.mail import send_mail
import random
from .sessionlogic import gen_session
from django.contrib.auth.models import User
from datetime import datetime
from django.contrib.sessions.backends.file import SessionStore
from django.conf import settings
from .models import Client
from django.db import connection
from . import dictfetchall as df


### STATUS GUIDE ###
### USER - ce73628f-b89c-47e3-8949-5d68301f277f ####
### MANAGER - 5b612290-d5bc-4632-8e21-bf0c1c81abb9 ###
### ADMIN - 726d6a5b-a90a-4d66-8ce9-f24001d27b24 ###

user_roles = ['ce73628f-b89c-47e3-8949-5d68301f277f', '5b612290-d5bc-4632-8e21-bf0c1c81abb9',
              '726d6a5b-a90a-4d66-8ce9-f24001d27b24']

superusers_emails = User.objects.filter(is_superuser=True).values_list('email')

staff_email = User.objects.filter(is_staff = True).values_list('email')
USER = 0
MANAGER = 1
ADMIN = 2
EmailCode = {}


def checkBan(request):
    if request.session.session_key is None:
        return False
    if request.session['uuid-ban'] is not None:
        interval = datetime.now() - datetime.strptime(request.session['uuid-ban'], '%Y-%m-%d %H:%M:%S.%f')
        if interval.total_seconds() > settings.BAN_DURATION:
            request.session['uuid-ban'] = None
            request.session.save()
            return True
        else:
            return False
    else:
        return True


def СodeGen():
    return random.randint(100000, 999999)


def EmailSender(request):
    if request.session.session_key is None:
        gen_session(request)
        return JsonResponse({'code': 23})
    if not checkBan(request):
        return JsonResponse({'code': 23})
    data = json.loads(request.body)
    email = data['email']
    code = СodeGen()
    EmailCode[email] = code

    send_mail('Ваш код подтверждения!', f'Ваш код: {code}', "atrs_and_crafts@mail.ru", [email], fail_silently=False)

    return JsonResponse({'code': 200})


def login(request):
    if request.session.session_key is None:
        gen_session(request)
        return JsonResponse({'code': 23})
    if request.session.get('count') >= settings.NUMBER_OF_LOGIN_ATTEMPTS:
        request.session['uuid-ban'] = str(datetime.now())
        request.session['count'] = 0
        request.session.save()

    if not checkBan(request):
        print('До окончания бана осталось: ', datetime.now() - datetime.strptime(request.session['uuid-ban'], '%Y-%m-%d %H:%M:%S.%f'))
        return JsonResponse({'code': 23})

    data = json.loads(request.body)
    email = data['email']
    code = int(data['code'])
    if EmailCode[email] == code:
        for i in superusers_emails:
            if email == i[0]:
                return JsonResponse({'code': 200, 'us': user_roles[ADMIN]})
        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                    select id from main_client
                    where email = '{email}';
                """
            )
            if len(cursor.fetchall()) <= 0:
                cursor.execute(
                    f"""
                        INSERT INTO main_client(email, uuid)
                        VALUES('{email}', '{request.session.session_key}');
                    """
                )
            else:
                cursor.execute(
                    f"""
                        UPDATE main_client
                        set uuid = '{request.session.session_key}'
                        where email = '{email}';
                    """
                )
        return JsonResponse({'code': 200, 'us': user_roles[USER]})
    else:
        request.session['count'] += 1
        request.session.save()

        print(request.session['count'])
        return JsonResponse({'code': 23})


def account_page_renderer(request):
    if request.session.session_key is None:
        gen_session(request)
        response = JsonResponse({'code': 23})
        if request.COOKIES.get('us'):
            response.delete_cookie("us")
        return response
    user_role = request.COOKIES['us']
    role_index = -1
    for zi in range(len(user_roles)):
        if user_role == user_roles[zi]:
            role_index = zi
            break
    if role_index == -1:
        return render(request, 'access_denied.html')
    elif role_index == USER:
        return render(request, 'main/purchases.html')
    elif role_index == MANAGER:
        return render(request, 'main/manager_page.html')
    elif role_index == ADMIN:
        return redirect('/admin')
