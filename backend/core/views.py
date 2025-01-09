from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required
from core import app
from flask import json, request

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response

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
    token = create_access_token(identity=login)
    return {
        'token': token,
        'message': 'ok',
    }

@app.route('/profile')
@jwt_required()
def get_profile():
    return {
        'login': get_jwt_identity()
    }