from django.shortcuts import render
from django.http import JsonResponse
import json
from django.conf import settings
from django.core.mail import send_mail
import random


EmailCode = {}
def СodeGen():
    return  random.randint(100000,999999)



def EmailSender(request):
    email = request.GET.get('email')
    code = СodeGen()
    EmailCode[email] = code

    send_mail('Ваш код подтверждения!', f'Ваш код: {code}', "atrs_and_crafts@mail.ru",
              [email], fail_silently=False)
    return render(request, 'index.html')

def login (request):
    email = request.GET.get('email')
    verifi_code = request.GET.get('code')
    if EmailCode[email] == verifi_code:

        print('great!')
    else:
        print('bad code')
