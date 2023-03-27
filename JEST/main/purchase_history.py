from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from . import dictfetchall as df
from .models import Client
from datetime import datetime
import json


def purchases(request):
    pass
    """uuid = request.session['UUID']
    uuid_s = uuid_status[uuid][0]
    uuid_t = uuid_status[uuid][1]

    if (uuid_t > datetime.now()) and (uuid_s = '0'):
        query = f""""""
        select * from purchases
        where uuid = {uuid};
        """"""
"""





