from core import app

@app.route('/')
def index():
    return {
        'msg': 'Hello there'
    }