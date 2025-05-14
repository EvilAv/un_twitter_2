import React, { useEffect, useState } from "react";
import { Post } from "../../components/post";

import styles from "./styles.module.css";
import { useUnit } from "effector-react";
import { $posts, postsLoadingAborted, postsLoadingStarted } from "../../features/posts/state";

type Props = {
    userId?: number;
};

export const PostList = ({ userId}: Props) => {

    const loadPosts = useUnit(postsLoadingStarted);
    const abortLoading = useUnit(postsLoadingAborted);
    const posts = useUnit($posts);

    useEffect(() => {
        loadPosts(userId);
        return abortLoading;
    }, []);

    return (
        <div className={styles.root}>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <Post
                        key={post.id}
                        text={post.text}
                        authorId={post.authorId}
                        authorName={post.authorName}
                        id={post.id}
                    />
                ))
            ) : (
                <div>:(</div>
            )}
        </div>
    );
};
