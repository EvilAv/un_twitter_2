import React, { useEffect } from "react";
import { useParams } from "react-router";

import UserIcon from "../../icons/user.svg";
import SubscribeIcon from "../../icons/subscribe.svg";
import UnsubscribeIcon from "../../icons/unsubscribe.svg";

import styles from "./styles.module.css";
import { User } from "../../features/recomendations/types";
import { useUnit } from "effector-react";
import {
    $subscriptions,
    $userInfo,
    userLoaded,
} from "../../features/recomendations/state";
import { $user } from "../../features/user/state";

const AVATAR_SIZE = 100;
const ICON_SIZE = 50;

const isSubscribedTo = (subscribes: User[], user: User) => {
    return subscribes.some(({ id }) => id === user.id);
};

export const UserPage = () => {
    const { id } = useParams();
    const user = useUnit($userInfo);
    const selfUser = useUnit($user);
    const subscriptions = useUnit($subscriptions);

    const loadUser = useUnit(userLoaded);

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
                    <>
                        {isSubscribed ? (
                            <img
                                className={styles.btn}
                                src={UnsubscribeIcon}
                                height={ICON_SIZE}
                                width={ICON_SIZE}
                            />
                        ) : (
                            <img
                                className={styles.btn}
                                src={SubscribeIcon}
                                height={ICON_SIZE}
                                width={ICON_SIZE}
                            />
                        )}
                    </>
                )}
            </div>
            <div>
                <div>
                    <b>Posts:</b>
                </div>
                <div>456</div>
            </div>
        </div>
    );
};
