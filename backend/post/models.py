from core import db

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # date and times are so much pain in ass in python (at least ain django)
    # so this fields will be add later
    

    def __repr__(self):
        return f'Post #{self.id} ({self.text}) by {self.author}'