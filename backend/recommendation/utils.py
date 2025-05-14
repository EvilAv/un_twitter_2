def get_all_subscriptions(user):
    arr = []
    for s in user.subscriptions:
        arr.append({
            'id': s.to_user_id,
            'nickname': s.user_to.nickname,
            'login': s.user_to.login
        })
    return arr
