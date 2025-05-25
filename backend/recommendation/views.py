from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import request
from core.errors import make_json_error
from core.models import User
from post.models import Post
from recommendation import recommendation
from recommendation.models import Subscription, Like
from recommendation.utils import get_all_subscriptions
from core import db


@recommendation.route('/subscriptions')
@jwt_required()
def get_subscriptions():
    id = int(get_jwt_identity())
    user = db.session.execute(db.select(User).filter_by(id=id)).scalar_one_or_none()
    if not user:
        return make_json_error('user not found', 404)
    return {
        'subscriptions': get_all_subscriptions(user),
    }

@recommendation.route('/subscribe/<to_user_id>', methods=['POST'])
@jwt_required()
def subscribe_user(to_user_id):
    from_user_id = int(get_jwt_identity())
    user_from = db.session.execute(db.select(User).filter_by(id=from_user_id)).scalar_one_or_none()
    user_to = db.session.execute(db.select(User).filter_by(id=int(to_user_id))).scalar_one_or_none()

    if not user_from or not user_to:
        return make_json_error('user not found', 404)

    duplicate = db.session.execute(db.select(Subscription).filter_by(user_from=user_from, user_to=user_to)).scalar_one_or_none()
    if duplicate:
        return make_json_error('subscription already exists', 400)

    new_subscription = Subscription(user_from=user_from, user_to=user_to)
    db.session.add(new_subscription)
    db.session.commit()

    return {
        'subscriptions': get_all_subscriptions(user_from),
    }

@recommendation.route('/unsubscribe/<to_user_id>', methods=['POST'])
@jwt_required()
def unsubscribe_user(to_user_id):
    from_user_id = int(get_jwt_identity())
    user_from = db.session.execute(db.select(User).filter_by(id=from_user_id)).scalar_one_or_none()
    user_to = db.session.execute(db.select(User).filter_by(id=int(to_user_id))).scalar_one_or_none()

    if not user_from or not user_to:
        return make_json_error('user not found', 404)

    subscription = db.session.execute(db.select(Subscription).filter_by(user_from=user_from, user_to=user_to)).scalar_one_or_none()
    if not subscription:
        return make_json_error('subscription doesn`t exist', 404)

    db.session.delete(subscription)
    db.session.commit()

    return {
        'subscriptions': get_all_subscriptions(user_from),
    }

@recommendation.route('/user/<user_id>')
def get_user(user_id):
    user = db.session.execute(db.select(User).filter_by(id=int(user_id))).scalar_one_or_none()

    if not user:
        return make_json_error('user not found', 404)
    
    return {
        'id': user.id,
        'nickname': user.nickname,
        'login': user.login,
    }

@recommendation.route('/like/<_post_id>', methods=['POST'])
@jwt_required()
def like_post(_post_id):
    user_id = int(get_jwt_identity())
    user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one_or_none()
    if not user:
        return make_json_error('user not found', 404)

    post_id = int(_post_id)
    post = db.session.execute(db.select(Post).filter_by(id=post_id)).scalar_one_or_none()
    if not post:
        return make_json_error('post not found', 404)
    
    duplicate = db.session.execute(db.select(Like).filter_by(user_id=user_id, post_id=post_id)).scalar_one_or_none()

    if duplicate:
        return make_json_error('like already exists', 400)

    new_like = Like(user_id=user_id, post_id=post_id)
    db.session.add(new_like)
    if post.likes is None:
        post.likes = 0
    post.likes = post.likes + 1
    db.session.commit()

    return {}

@recommendation.route('/unlike/<_post_id>', methods=['POST'])
@jwt_required()
def unlike_post(_post_id):
    user_id = int(get_jwt_identity())
    user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one_or_none()
    if not user:
        return make_json_error('user not found', 404)

    post_id = int(_post_id)
    post = db.session.execute(db.select(Post).filter_by(id=post_id)).scalar_one_or_none()
    if not post:
        return make_json_error('post not found', 404)
    
    like = db.session.execute(db.select(Like).filter_by(user_id=user_id, post_id=post_id)).scalar_one_or_none()

    if not like:
        return make_json_error('like doesn`t exists', 400)

    db.session.delete(like)
    if post.likes is None:
        post.likes = 1
    post.likes = post.likes - 1
    db.session.commit()

    return {}