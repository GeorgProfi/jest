import uuid

import django


def gen_session(request):
    session = request.session
    UUID = session.get('UUID')
    django.middleware.csrf.get_token(request)
    if UUID is None:
        session['UUID'] = str(uuid.uuid4())

