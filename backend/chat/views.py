from flask_jwt_extended import get_jwt_identity, jwt_required
from core.errors import make_json_error
from core.models import User
from chat import chat
from core import db

@chat.route('/dialogues')
@jwt_required()
def get_dialogues():
    id = int(get_jwt_identity())
    user = db.session.execute(db.select(User).filter_by(id=id)).scalar_one_or_none()
    if not user:
        return make_json_error('user not found', 404)
    arr = []
    for d in user.dialogues1:
        companion = d.user2
        arr.append({
            'id': d.id,
            'userId': companion.id,
            'userLogin': companion.login,
            'userNickname': companion.nickname
        })
    for d in user.dialogues2:
        companion = d.user1
        arr.append({
            'id': d.id,
            'userId': companion.id,
            'userLogin': companion.login,
            'userNickname': companion.nickname
        })
    
    return {
        'dialogues': arr
    }
