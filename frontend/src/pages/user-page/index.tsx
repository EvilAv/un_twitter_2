import React, { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import UserIcon from "../../icons/user.svg";
import SubscribeIcon from "../../icons/subscribe.svg";
import UnsubscribeIcon from "../../icons/unsubscribe.svg";
import StartChat from "../../icons/start-chat.svg";

import styles from "./styles.module.css";
import { User } from "../../features/recomendations/types";
import { useUnit } from "effector-react";
import {
    $subscriptions,
    $userInfo,
    subscribed,
    unsubscribed,
    userLoaded,
} from "../../features/recomendations/state";
import { $user } from "../../features/user/state";
import { PostList } from "../../components/post-list";
import { dialogStarted } from "../../features/chat/state";

const AVATAR_SIZE = 100;
const ICON_SIZE = 50;

// need to find out on backend
const isSubscribedTo = (subscribes: User[], user: User) => {
    return subscribes.some(({ id }) => id === user.id);
};

export const UserPage = () => {
    const { id } = useParams();
    const user = useUnit($userInfo);
    const selfUser = useUnit($user);
    const subscriptions = useUnit($subscriptions);
    const unsubscribe = useUnit(unsubscribed);
    const subscribe = useUnit(subscribed);
    const startDialog = useUnit(dialogStarted);

    const loadUser = useUnit(userLoaded);

    const navigate = useNavigate();

    const handleUnsubscribeClick = useCallback(() => {
        unsubscribe(Number(id));
        navigate("/subscriptions");
    }, [id]);

    const handleStartDialog = useCallback(() => {
        startDialog(Number(id));
        navigate("/chats");
    }, [user]);

    const handleSubscribeClick = useCallback(() => {
        subscribe(Number(id));
        navigate("/subscriptions");
    }, [id]);

    useEffect(() => {
        loadUser(Number(id));
    }, [id]);

    if (!user) {
        return null;
    }
    const isSubscribed = isSubscribedTo(subscriptions, user);

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <img
                    className={styles.avatar}
                    src={UserIcon}
                    height={AVATAR_SIZE}
                    width={AVATAR_SIZE}
                />
                <div>
                    <div className={styles.nickname}>{user.nickname}</div>
                    <div className={styles.link}>@{user.login}</div>
                </div>
                {selfUser?.id !== user.id && (
                    <div className={styles['btn-group']}>
                        {isSubscribed ? (
                            <img
                                className={styles.btn}
                                src={UnsubscribeIcon}
                                height={ICON_SIZE}
                                width={ICON_SIZE}
                                onClick={handleUnsubscribeClick}
                            />
                        ) : (
                            <img
                                className={styles.btn}
                                src={SubscribeIcon}
                                height={ICON_SIZE}
                                width={ICON_SIZE}
                                onClick={handleSubscribeClick}
                            />
                        )}
                        <img
                            className={styles.btn}
                            src={StartChat}
                            height={ICON_SIZE}
                            width={ICON_SIZE}
                            onClick={handleStartDialog}
                        />
                    </div>
                )}
            </div>
            <div className={styles["post-title"]}>
                <b>Posts:</b>
            </div>

            <PostList userId={user.id} />
        </div>
    );
};
