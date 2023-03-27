import json

from django.http import JsonResponse
from django.core.mail import send_mail
import random

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
        print('great!')
    else:
        print('bad code')
