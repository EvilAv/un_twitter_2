from core import db
from sqlalchemy.orm import relationship
import datetime
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
    liked = relationship('Like', backref='liked_post', cascade='all, delete-orphan')
    emotion = db.Column(db.Enum(Emotion), nullable=False)
    date = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    

    def __repr__(self):
        return f'Post #{self.id} ({self.text}) by {self.author}'