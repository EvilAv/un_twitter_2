def serialize_post(raw_post):
    return {
        'id': raw_post.id,
        'text': raw_post.text,
        'authorName': raw_post.author.nickname,
        'authorId': raw_post.user_id, 
        'authorLogin': raw_post.author.login,
    }