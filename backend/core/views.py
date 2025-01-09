from flask_jwt_extended import create_access_token
from core import app
from flask import request

@app.route('/')
def index():
    return {
        'msg': 'Hello there'
    }

@app.route('/login', methods=['POST'])
def create_token():
    login = request.json.get('login', None)
    password = request.json.get('password', None)
    if login != 'kenny' and password != 'kenny':
        return {
            'message': 'wrong!'
        }, 401
    token = create_access_token(identity='12')
    return {
        'token': token,
        'message': 'ok',
    }