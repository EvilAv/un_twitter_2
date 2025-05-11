def get_all_subscriptions(user):
    arr = []
    for s in user.subscriptions:
        arr.append(s.to_user_id)
    return arr
