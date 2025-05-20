def serialize_post(raw_post):
    return {
        'id': raw_post.id,
        'text': raw_post.text,
        'authorName': raw_post.author.nickname,
        'authorId': raw_post.user_id, 
        'authorLogin': raw_post.author.login,
        'likes': raw_post.likes,
        'isLiked': False,
    }

def get_id_from_post(post):
    return post.id

def serialize_posts(posts, user):
    liked_posts_by_user = set(map(get_id_from_post,user.liked))
    arr = []
    print(liked_posts_by_user)
    for post in posts:
        arr.append(serialize_post(post))
        if post.id in liked_posts_by_user:
            arr[-1]['isLiked'] = True
    return arr