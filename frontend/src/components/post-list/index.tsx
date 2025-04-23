import React, { useEffect, useState } from "react";
import { TPost } from "../../features/posts/types";
import { Post } from "../../components/post";

import styles from "./styles.module.css";
import { useUnit } from "effector-react";
import { $posts, postsLoadingStarted } from "../../features/posts/state";

type Props = {
    userId?: number;
};

export const PostList = ({ userId}: Props) => {

    const loadPosts = useUnit(postsLoadingStarted);
    const posts = useUnit($posts);

    useEffect(() => {
        loadPosts(userId);
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
