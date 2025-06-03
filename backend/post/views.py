from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import jsonify, request
from core.errors import make_json_error
from core.models import User
from post.models import Emotion, Post
from post import post
from post.serializers import serialize_post, serialize_posts
from core import db
import random

BATCH_SIZE = 6

# @post.route('/all')
# @jwt_required()
# def all_posts():
#     id = int(get_jwt_identity())
#     user_id = request.args.get('user')
#     posts = []
#     # TODO: fix some issues, like it can be no user with such id
#     if user_id:
#         posts = db.session.execute(db.select(Post).filter_by(user_id=int(user_id))).scalars().all()
#         # user = db.session.execute(db.select(User).filter_by(id=int(user_id))).scalar_one_or_none()
#         #     if user:
#         #         posts = user.posts
#     else:
#         posts = db.session.execute(db.select(Post)).scalars().all()

#     # TODO: add data field to endpoint responses
#     user = db.session.execute(db.select(User).filter_by(id=id)).scalar_one_or_none()
#     if user:
#         return jsonify(serialize_posts(posts, user))
        
#     return jsonify(list(map(serialize_post, posts)))

@post.route('/posts/<_offset>')
@jwt_required()
def get_posts(_offset):
    id = int(get_jwt_identity())
    offset = int(_offset)
    user_id = request.args.get('user')
    posts = []
    if user_id:
        posts = db.session.execute(db.select(Post).filter_by(user_id=int(user_id))).scalars().all()[offset:offset + BATCH_SIZE]
    else:
        posts = db.session.execute(db.select(Post)).scalars().all()[offset:offset + BATCH_SIZE]

    user = db.session.execute(db.select(User).filter_by(id=id)).scalar_one_or_none()
    if not user:
        return make_json_error('user not found', 404)

    return jsonify(serialize_posts(posts, user))

@post.route('/create', methods=['POST'])
@jwt_required()
def add_post():
    id = int(get_jwt_identity())
    user = db.session.execute(db.select(User).filter_by(id=id)).scalar_one_or_none()
    if not user:
        return make_json_error('user not found', 404)
    text = request.json.get('text', None)
    if not text or text.strip() == '':
        return make_json_error('empty text provided', 400)

    emotion = random.randint(0,5)
    new_post = Post(text=text, author=user, emotion=Emotion(emotion).name)
    db.session.add(new_post)
    db.session.commit()

    print(new_post.emotion)

    return {
        'id': new_post.id,
        'text': text,
        'authorName': user.nickname,
        'authorId': user.id,
        'authorLogin': user.login,
        'emotion': new_post.emotion.value
    }

@post.route('/delete/<post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    user_id = int(get_jwt_identity())
    user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one_or_none()
    if not user:
        return make_json_error('user not found', 404)

    post = db.session.execute(db.select(Post).filter_by(id=int(post_id))).scalar_one_or_none()
    if not post or post.user_id != user_id:
        return make_json_error('post not found', 404)
    
    db.session.delete(post)
    db.session.commit()

    return {}
    
