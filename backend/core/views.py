from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required
from core import app, db, bcrypt, jwt, compress
from core.errors import make_json_error
from flask import json, request, send_file

from core.models import User


@jwt.invalid_token_loader
def invalid_token_callback(error):
    return make_json_error('token has expired', 401)

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
    return make_json_error('a', 451)

@app.route('/login', methods=['POST'])
def create_token():
    login = request.json.get('login', None)
    if not login:
        return make_json_error('no login', 400)

    password = request.json.get('password', None)
    if not password:
        return make_json_error('no password', 400)

    # legacy
    # user = User.query.filter_by(login=login).first()
    user = db.session.execute(db.select(User).filter_by(login=login)).scalar_one_or_none()
    if not user:
        return make_json_error('user not found', 404)

    if bcrypt.check_password_hash(user.password_hash, password):
        print('ok')
        token = create_access_token(identity=str(user.id))
        return {
            'token': token,
            'nickname': user.nickname,
            'id': user.id
        }
    return make_json_error('wrong password', 401)

@app.route('/register', methods=['POST'])
def register_new_user():
    login = request.json.get('login', None)
    if not login:
        return make_json_error('no login', 400)
    old_user = db.session.execute(db.select(User).filter_by(login=login)).scalar_one_or_none()
    if old_user:
        return make_json_error('user already exists', 403)

    nickname = request.json.get('nickname', None)
    if not nickname:
        nickname = login

    password1 = request.json.get('password1', None)
    password2 = request.json.get('password2', None)
    # cause thats how de morgan works
    if not (password1 and password2):
        return make_json_error('no password', 400)
    if password1 != password2:
        return make_json_error('passwords are not equal', 400)

    password_hash = bcrypt.generate_password_hash(password1).decode('utf8')
    new_user = User(login=login, nickname=nickname, password_hash=password_hash)

    db.session.add(new_user)
    db.session.commit()

    token = create_access_token(identity=str(new_user.id))
    return {
        'token': token,
        'nickname': new_user.nickname,
        'id': new_user.id
    }

@app.route('/profile')
@jwt_required()
def get_profile():
    id = int(get_jwt_identity())
    user = db.session.execute(db.select(User).filter_by(id=id)).scalar_one_or_none()
    if not user:
        return make_json_error('user not found', 404)

    return {
        'nickname': user.nickname,
        'id': user.id
    }

@app.route('/model')
@compress.compressed()
def get_model():
    return send_file('./model.json')

@app.route('/binary/<name>')
def get_binary(name):
    return send_file(f'./{name}', as_attachment=True)