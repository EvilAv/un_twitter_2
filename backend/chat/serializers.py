def serialize_message(message):
    return {
        'text': message.text,
        'date': message.date.strftime('%d %b %Y, %H:%M'),
        'authorId': message.user_id
    }