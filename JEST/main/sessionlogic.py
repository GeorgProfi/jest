import uuid

def gen_session(request):
    session = request.session
    UUID = session.get('UUID')
    if UUID is None:
        session['UUID'] = str(uuid.uuid4())