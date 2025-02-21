import os
from flask import request
from core.errors import make_json_error
from post.models import Post
from emotions import emotions
from emotions.type import Emotion
from core import db
import numpy as np
import random

if os.environ.get('EMOTION_RECOGNITION') == 'True':
    from emotions.sybil import prepocess, word_to_vector
    import keras

    # for some reasons file can't be called types.py ¯\_(ツ)_/¯
    basedir = os.path.abspath(os.path.dirname(__file__))
    net = keras.models.load_model(os.path.join(basedir, 'bb.keras'))

@emotions.route('/one')
def get_one_emotion():
    post_id = request.args.get('post')
    if post_id:
        post = db.session.execute(db.select(Post).filter_by(id=int(post_id))).scalar_one_or_none()
        if os.environ.get('EMOTION_RECOGNITION') == 'True':
            if post and net:
                # by the way there is lib for js for same thing
                tokens = prepocess(post.text)
                vec = [word_to_vector(t) for t in tokens]
                # to fix shape
                vec = np.array(vec, ndmin=3)
                # print(vec.shape)
                result = net.predict(vec)
                print(result[0])
                # cause result has 2 dimensions for some reason
                return {
                    'emotion': Emotion(np.argmax(result[0])).name
                }
        else:
            return {
                'emotion': Emotion(random.choice(range(5))).name
            }
    return make_json_error('user not found', 404)