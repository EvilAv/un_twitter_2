import React from "react";
import { TPost } from "../../features/posts/types";

import styles from './styles.module.css'

export const Post = ({
    authorName,
    text,
}: TPost) => (
    <div className={styles.root}>
        <div className={styles.header} >
            <span>{authorName}</span>
            <span className={styles.emotion} title="nothing">😐</span>
        </div>
        <hr />
        <div className={styles.text}>{text}</div>
    </div>
)