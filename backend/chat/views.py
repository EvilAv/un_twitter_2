from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from core.errors import make_json_error
from core.models import User
from chat import chat
from chat.models import Dialog, Emotion, Message
from chat.serializers import serialize_date, serialize_message
from core import db, socketio
from flask_socketio import join_room, leave_room
import datetime

BATCH_SIZE = 20

rooms = {}

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

@chat.route('/start-dialog/<_user_id>', methods=["POST"])
@jwt_required()
def add_dialog(_user_id):
    id1 = int(get_jwt_identity())
    id2 = int(_user_id)
    user1 = db.session.execute(db.select(User).filter_by(id=id1)).scalar_one_or_none()
    user2 = db.session.execute(db.select(User).filter_by(id=id2)).scalar_one_or_none()
    if not user1 or not user2:
        return make_json_error('user not found', 404)
    
    duplicate1 = db.session.execute(db.select(Dialog).filter_by(user1_id=id1, user2_id=id2)).scalar_one_or_none()
    duplicate2 = db.session.execute(db.select(Dialog).filter_by(user1_id=id2, user2_id=id1)).scalar_one_or_none()

    if duplicate1 or duplicate2:
        return make_json_error('dialog already exists', 400)

    new_d = Dialog(
        user1= user1,
        user2= user2
    )

    db.session.add(new_d)
    db.session.commit()

    return {}

# @socketio.on('connect')
# @jwt_required()
# def handle_connect():
#     # socketio.emit('error', 'unauthorized')        
#     print('it works')

@socketio.on('join')
@jwt_required()
def handle_join(dialog_id):
    join_room(dialog_id)
    rooms[request.sid] = dialog_id
    dialog = db.session.execute(db.select(Dialog).filter_by(id=int(dialog_id))).scalar_one_or_none()
    if not dialog:
        socketio.emit('error', 'no dialog', to=dialog_id)
    socketio.emit('msg', to=dialog_id)

@socketio.on('disconnect')
def handle_disconnect():
    room = rooms[request.sid]
    leave_room(room)
    rooms.pop(request.sid)

@socketio.on('send-message')
@jwt_required()
def handle_send_message(message):
    id = int(get_jwt_identity())
    room = rooms[request.sid]
    date = datetime.datetime.now(datetime.timezone.utc)

    new_msg = Message (
        text=message['text'],
        mine_text=message['mineText'],
        nonce=message['nonce'],
        emotion=Emotion(int(message['emotion'])).name,
        user_id=id,
        date=date,
        dialog_id=int(room)
    )

    db.session.add(new_msg)
    db.session.commit()

    socketio.emit('receive-message', serialize_message(new_msg), to=room)
    print(rooms)
    