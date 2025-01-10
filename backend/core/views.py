from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required
from core import app, db, bcrypt
from flask import json, request

from core.models import User

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
    if login and password:
        # legacy
        # user = User.query.filter_by(login=login).first()
        user = db.session.execute(db.select(User).filter_by(login=login)).scalar_one_or_none()
        if user and bcrypt.check_password_hash(user.password_hash, password):
            print('ok')
            token = create_access_token(identity=login)
            return {
                'token': token,
            }
    return {
        'message': 'wrong!'
    }, 401

@app.route('/profile')
@jwt_required()
def get_profile():
    login = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(login=login)).scalar_one()
    return {
        'nickname': user.nickname
    }