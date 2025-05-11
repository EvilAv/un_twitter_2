from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import request
from core.errors import make_json_error
from core.models import User
from post.models import Post
from recommendation import recommendation
from recommendation.models import Subscription
from recommendation.utils import get_all_subscriptions
from core import db


@recommendation.route('/subscriptions')
def get_subscriptions():
    # temporary only for tests
    id = request.args.get('user')
    user = db.session.execute(db.select(User).filter_by(id=id)).scalar_one_or_none()
    if not user:
        return make_json_error('user not found', 404)
    return {
        'subscriptions': get_all_subscriptions(user),
    }

@recommendation.route('subscribe')
def subscribe_user():
    # temporary only for tests
    from_user_id = request.args.get('original_user')
    to_user_id = request.args.get('user')
    user_from = db.session.execute(db.select(User).filter_by(id=from_user_id)).scalar_one_or_none()
    user_to = db.session.execute(db.select(User).filter_by(id=to_user_id)).scalar_one_or_none()

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

@recommendation.route('unsubscribe')
def unsubscribe_user():
    # temporary only for tests
    from_user_id = request.args.get('original_user')
    to_user_id = request.args.get('user')
    user_from = db.session.execute(db.select(User).filter_by(id=from_user_id)).scalar_one_or_none()
    user_to = db.session.execute(db.select(User).filter_by(id=to_user_id)).scalar_one_or_none()

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
