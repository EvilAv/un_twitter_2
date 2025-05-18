import React, { useCallback, useEffect, useState } from "react";
import { TPost } from "../../features/posts/types";
import UserIcon from "../../icons/user.svg";

import styles from "./styles.module.css";
import { TEmotion } from "../../features/emotion/type";
import { getOneEmotion } from "../../features/emotion/lib";
import { useNavigate } from "react-router";

const ICON_SIZE = 30;

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

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.user}>
                    <img
                        src={UserIcon}
                        width={ICON_SIZE}
                        height={ICON_SIZE}
                        className={styles.avatar}
                    />
                    <div>
                        <div>{authorName}</div>
                        <div className={styles.link} onClick={handleUserClick}>
                            @{authorLogin}
                        </div>
                    </div>
                </div>
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
