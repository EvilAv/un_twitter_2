from core import db
from sqlalchemy.orm import relationship

from enum import Enum

class Emotion(Enum):
    SADNESS = 0
    JOY = 1
    LOVE = 2
    ANGER = 3
    FEAR = 4
    SURPRISE = 5

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    likes = db.Column(db.Integer, default=0)
    # date and times are so much pain in ass in python (at least ain django)
    # so this fields will be add later
    liked = relationship('Like', backref='liked_post', cascade='all, delete-orphan')
    emotion = db.Column(db.Enum(Emotion), nullable=False)
    

    def __repr__(self):
        return f'Post #{self.id} ({self.text}) by {self.author}'