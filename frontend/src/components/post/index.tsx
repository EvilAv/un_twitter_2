import React, { useEffect, useState } from "react";
import { TPost } from "../../features/posts/types";

import styles from "./styles.module.css";
import { TEmotion } from "../../features/emotion/type";
import { getOneEmotion } from "../../features/emotion/lib";

export const Post = ({ authorName, text, id }: TPost) => {
    const [emotion, setEmotion] = useState<TEmotion | null>(null);
    useEffect(() => {
        getOneEmotion(id).then((emo) => setEmotion(emo));
    }, [setEmotion]);
    console.log(emotion);
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <span>{authorName}</span>
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
