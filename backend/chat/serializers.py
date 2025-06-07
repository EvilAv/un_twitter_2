def serialize_message(message):
    return {
        'text': message.text,
        'date': serialize_date(message.date),
        'authorId': message.user_id
    }

def serialize_date(date):
    return date.strftime('%d %b %Y, %H:%M')

def serialize_message(message):
    return {
        'text': message.text, 
        'mineText': message.mine_text, 
        'nonce': message.nonce,
        'date': serialize_date(message.date), 
        'authorId': message.user_id,
        'emotion': message.emotion.value,
    }
