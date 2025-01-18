from flask_jwt_extended import jwt_required
from flask import jsonify, request
from core.models import User
from post.models import Post
from post import post
from post.serializers import serialize_post
from core import db

@post.route('/test')
@jwt_required()
def test_post():
    return {
        'test': 'test'
    }

@post.route('/all')
def all_posts():
    user_id = request.args.get('user')
    posts = []
    if user_id:
        posts = db.session.execute(db.select(Post).filter_by(user_id=int(user_id))).scalars().all()
        # user = db.session.execute(db.select(User).filter_by(id=int(user_id))).scalar_one_or_none()
    #     if user:
    #         posts = user.posts
    else:
        posts = db.session.execute(db.select(Post)).scalars().all()

    # TODO: add data field to endpoint responses

    return jsonify(list(map(serialize_post, posts)))