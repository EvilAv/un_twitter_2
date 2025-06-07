def serialize_date(date):
    return date.strftime('%d %b %Y, %H:%M')

def serialize_post(raw_post, is_liked = False):
    return {
        'id': raw_post.id,
        'text': raw_post.text,
        'authorName': raw_post.author.nickname,
        'authorId': raw_post.user_id, 
        'authorLogin': raw_post.author.login,
        'likes': raw_post.likes,
        'emotion': raw_post.emotion.value,
        'isLiked': is_liked,
        'date': serialize_date(raw_post.date)
    }

def get_post_id_from_like(like):
    return like.liked_post.id

def serialize_posts(posts, user):
    liked_posts_by_user = set(map(get_post_id_from_like, user.liked))
    arr = []
    print(liked_posts_by_user)
    for post in posts:
        flag = False
        if post.id in liked_posts_by_user:
            flag = True
        arr.append(serialize_post(post, flag))

    return arr