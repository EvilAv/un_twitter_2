from core import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(100))
    nickname = db.Column(db.String(100))
    password_hash = db.Column(db.String(255))

    def __repr__(self):
        return f'User #{self.id} ({self.login})'
