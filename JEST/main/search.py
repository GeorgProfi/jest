from django.http import JsonResponse
from .models import Product
from difflib import SequenceMatcher as SM

import json


def get_product_with_similarity_titles(request):
    min_percent = '0.7'
    if 'title' in request.GET:
        titles = request.GET['title'].split()
        result = []
        productObjects = Product.objects.all()
        for title in titles:
            title = title.lower()
            for el in productObjects:
                title_fragments = el.title.lower().split()
                percent_for_fragments = []
                for fragment in title_fragments:
                    percent_for_fragments.append(
                        float(SM(isjunk=None, a=fragment, b=title, autojunk=True).ratio()))
                percent = max(percent_for_fragments)
                if float(percent) >= float(min_percent):
                    result.append(el.title)
        result = set(result)
        result = list(result)
        data = {}
        for i in range(1, len(result) + 1):
            data[f'title{i}'] = result[i - 1]
    return JsonResponse(
        {
            'count': f'{len(data)}',
            'data': f"{json.dumps(data)}"
        }
    )



