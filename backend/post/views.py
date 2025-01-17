from flask_jwt_extended import jwt_required
from flask import jsonify
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
    posts = db.session.execute(db.select(Post)).scalars().all()
    # TODO: add data field to endpoint responses
    print(list(map(serialize_post, posts)))
    return jsonify(list(map(serialize_post, posts)))