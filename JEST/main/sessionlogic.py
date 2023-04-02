from datetime import datetime
from django.conf import settings
import django
from datetime import datetime
from django.contrib.sessions.backends.file import SessionStore


def gen_session(request):
    django.middleware.csrf.get_token(request)
    if request.session.session_key is None:
        request.session['uuid-ban'] = None
        request.session['count'] = 0




