from sqlalchemy.orm import relationship
from core import db
    
class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user_from = relationship('User', backref='subscriptions', foreign_keys=[from_user_id])
    user_to = relationship('User', backref='subscription_to', foreign_keys=[to_user_id])



    def __repr__(self):
        return f'Subscription #{self.id} from {self.user_from} to {self.user_to}'