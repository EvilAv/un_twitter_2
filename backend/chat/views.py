from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from chat.serializers import serialize_message
from core.errors import make_json_error
from core.models import User
from chat import chat
from chat.models import Dialog, Message
from core import db

BATCH_SIZE = 20

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

@chat.route('/messages/<_dialog_id>/<_offset>')
@jwt_required()
def get_messages(_dialog_id, _offset):
    dialog_id = int(_dialog_id)
    offset = int(_offset)
    dialog = db.session.execute(db.select(Dialog).filter_by(id=dialog_id)).scalar_one_or_none()
    if not dialog:
        return make_json_error('dialog not found', 404)
    # if there is no messages just return an empty array
    messages = db.session.execute(db.select(Message).filter_by(dialog_id=dialog_id).order_by(Message.date.desc())).scalars().all()[offset:offset + BATCH_SIZE]
    print(messages)

    return jsonify(list(map(serialize_message, messages)))