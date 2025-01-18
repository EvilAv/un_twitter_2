from flask import request
from post.models import Post
from emotions import emotions
from emotions.types import Emotion
from core import db

@emotions.route('/one')
def get_one_emotion():
    post_id = request.args.get('post')
    if post_id:
        post = db.session.execute(db.select(Post).filter_by(id=int(post_id))).scalar_one_or_none()
        if post:
            return {
                'emotion': Emotion(1).name
            }
    return {}, 404