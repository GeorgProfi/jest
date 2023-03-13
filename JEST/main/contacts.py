from django.shortcuts import render
from django.http import JsonResponse
import json
from .models import Emploee, MasterInfo
from django.db import connection



def get_masters(request):
    pass
    """with connection.cursor() as cursor:
        data = []
        cursor.execute(
            "select id, name, surname, post from"
            "main_post join "
        )

        row = cursor.fetchall()
        for i in range(int(count)):
            block_data = {
                'name': f'{row[i][1]} {row[i][2]}',
                "review_text": f"{row[i][4]}",
                "date": f"{row[i][5].date()}"
            }
            data.append(block_data)
        return JsonResponse("""
