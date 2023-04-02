import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core.mail import send_mail
import random
from django.contrib.auth.models import User

### STATUS GUIDE ###
### USER - ce73628f-b89c-47e3-8949-5d68301f277f ####
### MANAGER - 5b612290-d5bc-4632-8e21-bf0c1c81abb9 ###
### ADMIN - 726d6a5b-a90a-4d66-8ce9-f24001d27b24 ###

user_roles = ['ce73628f-b89c-47e3-8949-5d68301f277f', '5b612290-d5bc-4632-8e21-bf0c1c81abb9',
              '726d6a5b-a90a-4d66-8ce9-f24001d27b24']

superusers_emails = User.objects.filter(is_superuser=True).values_list('email')

staff_email = User.objects.filter(is_staff = True).values_list('email')
print(staff_email)
USER = 0
MANAGER = 1
ADMIN = 2
EmailCode = {}


def СodeGen():
    return random.randint(100000, 999999)


def EmailSender(request):
    data = json.loads(request.body)
    email = data['email']
    code = СodeGen()
    EmailCode[email] = code

    send_mail('Ваш код подтверждения!', f'Ваш код: {code}', "atrs_and_crafts@mail.ru", [email], fail_silently=False)

    return JsonResponse({'code': 200})


def login(request):
    data = json.loads(request.body)
    email = data['email']
    code = int(data['code'])
    if EmailCode[email] == code:
        for i in superusers_emails:
            if email == i[0]:
                return JsonResponse({'code': 200, 'us': user_roles[ADMIN]})
        return JsonResponse({'code': 200, 'us': user_roles[USER]})
    else:
        return JsonResponse({'code': 23})


def account_page_renderer(request):
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
