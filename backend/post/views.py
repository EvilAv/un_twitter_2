from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import jsonify, request
from core.errors import make_json_error
from core.models import User
from post.models import Post
from post import post
from post.serializers import serialize_post
from core import db

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

    new_post = Post(text=text, author=user)
    db.session.add(new_post)
    db.session.commit()

    return {
        'id': new_post.id,
        'text': text,
        'authorName': user.nickname,
        'authorId': user.id
    }
