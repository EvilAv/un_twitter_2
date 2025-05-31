from sqlalchemy.orm import relationship
from core import db
import datetime

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
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    dialog_id = db.Column(db.Integer, db.ForeignKey('dialog.id'), nullable=False)
    # >>> msg.date.strftime('%d %b %Y, %H:%M')
    # '25 May 2025, 17:26'
    date = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))

    user = relationship('User', backref='messages', foreign_keys=[user_id])
    dialog = relationship('Dialog', backref='messages', foreign_keys=[dialog_id])

    def __repr__(self):
        return f'Message #{self.id} from {self.user} in dialog #{self.dialog_id}'