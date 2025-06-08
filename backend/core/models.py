from sqlalchemy.orm import relationship
from core import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(100), nullable=False, unique=True)
    nickname = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    # means that we can access posts by user by this field
    # in Post we can access User object by field author
    posts = relationship('Post', backref='author', lazy='dynamic')
    public_key = db.Column(db.String(200), nullable=False)

    liked = relationship('Like', backref='author', cascade='all, delete-orphan')

    emo_profile = db.Column(db.JSON, default=[0, 0, 0, 0, 0, 0])

    def __repr__(self):
        return f'User #{self.id} ({self.login}) with public key - {self.public_key}'
