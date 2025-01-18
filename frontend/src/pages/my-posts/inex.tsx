import React from "react";
import { PostList } from "../../components/post-list";

import styles from './style.module.css'

type Props = {
    userId: number;
};

export const MyPosts = ({ userId }: Props) => {
    return (
        <>
            <h1>My posts</h1>
            <PostList userId={userId}/>
            <button className={styles.btn}>new post</button>
        </>
    );
};
