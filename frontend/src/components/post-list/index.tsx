import React, { useEffect, useState } from "react";
import { TPost } from "../../features/posts/types";
import { getAllPosts } from "../../features/posts/lib";
import { Post } from "../../components/post";

import styles from "./styles.module.css";

type Props = {
    userId?: number;
}

export const PostList = ({userId}: Props) => {
    const [posts, setPosts] = useState<TPost[]>([]);

    useEffect(() => {
        // with state manager all that shit will gone
        // emotions will get from another endpoint
        getAllPosts(userId).then((data) => {
            setPosts(data);
        });
    }, [userId]);
    return (
            <div className={styles.root}>
                {posts.map((post) => (
                    <Post
                        key={post.id}
                        text={post.text}
                        authorId={post.authorId}
                        authorName={post.authorName}
                        id={post.id}
                    />
                ))}
            </div>
    );
};
