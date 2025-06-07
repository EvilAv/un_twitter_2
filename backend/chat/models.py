from sqlalchemy.orm import relationship
from chat.serializers import serialize_date
from core import db
import datetime
from enum import Enum

class Emotion(Enum):
    SADNESS = 0
    JOY = 1
    LOVE = 2
    ANGER = 3
    FEAR = 4
    SURPRISE = 5

class Dialog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user1 = relationship('User', backref='dialogues1', foreign_keys=[user1_id])
    user2 = relationship('User', backref='dialogues2', foreign_keys=[user2_id])

    def __repr__(self):
        return f'Dialog #{self.id} between ${self.user1} and ${self.user2}'

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(255), nullable=False)
    mine_text = db.Column(db.String(255), nullable=False)
    nonce = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    dialog_id = db.Column(db.Integer, db.ForeignKey('dialog.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    emotion = db.Column(db.Enum(Emotion), nullable=False)

    user = relationship('User', backref='messages', foreign_keys=[user_id])
    dialog = relationship('Dialog', backref='messages', foreign_keys=[dialog_id])

    def __repr__(self):
        return f'Message #{self.id} from {self.user} in dialog #{self.dialog_id} at {serialize_date(self.date)}'