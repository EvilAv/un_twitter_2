import os
from flask import request
from post.models import Post
from emotions import emotions
from emotions.type import Emotion
from emotions.sybil import prepocess, word_to_vector
from core import db
import keras
import numpy as np

# for some reasons file can't be called types.py ¯\_(ツ)_/¯
basedir = os.path.abspath(os.path.dirname(__file__))
net = keras.models.load_model(os.path.join(basedir, 'a.keras'))

@emotions.route('/one')
def get_one_emotion():
    post_id = request.args.get('post')
    if post_id:
        post = db.session.execute(db.select(Post).filter_by(id=int(post_id))).scalar_one_or_none()
        if post and net:
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
    return {}, 404