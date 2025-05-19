import React, { useCallback, useEffect, useState } from "react";
import { TPost } from "../../features/posts/types";
import UserIcon from "../../icons/user.svg";
import DeleteIcon from "../../icons/delete.svg";

import styles from "./styles.module.css";
import { TEmotion } from "../../features/emotion/type";
import { getOneEmotion } from "../../features/emotion/lib";
import { useNavigate } from "react-router";
import { useUnit } from "effector-react";
import { $user } from "../../features/user/state";
import { postDeleted } from "../../features/posts/state";

const USER_ICON_SIZE = 30;
const DELETE_ICON_SIZE = 25;

export const Post = ({
    authorName,
    text,
    id,
    authorLogin,
    authorId,
}: TPost) => {
    const [emotion, setEmotion] = useState<TEmotion | null>(null);
    useEffect(() => {
        getOneEmotion(id).then((emo) => setEmotion(emo));
    }, [setEmotion]);
    const navigate = useNavigate();

    const handleUserClick = useCallback(() => {
        navigate(`/user/${authorId}`);
    }, [authorId]);

    const user = useUnit($user);
    const _deletePost = useUnit(postDeleted);

    const deletePost = useCallback(() => {
        _deletePost(id);
    }, [id, authorId, user])

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.user}>
                    <img
                        src={UserIcon}
                        width={USER_ICON_SIZE}
                        height={USER_ICON_SIZE}
                        className={styles.avatar}
                    />
                    <div>
                        <div>{authorName}</div>
                        <div className={styles.link} onClick={handleUserClick}>
                            @{authorLogin}
                        </div>
                    </div>
                </div>
                {user?.id === authorId && (
                        <img
                            src={DeleteIcon}
                            width={DELETE_ICON_SIZE}
                            height={DELETE_ICON_SIZE}
                            className={styles.delete}
                            onClick={deletePost}
                        />
                    )}
                {emotion && (
                    <span className={styles.emotion} title={emotion.emotion}>
                        {emotion.emoji}
                    </span>
                )}
            </div>
            <hr />
            <div className={styles.text}>{text}</div>
        </div>
    );
};
