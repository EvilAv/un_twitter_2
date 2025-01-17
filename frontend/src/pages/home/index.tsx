import React, { useEffect, useState } from "react";
import { TPost } from "../../features/posts/types";
import { getAllPosts } from "../../features/posts/lib";
import { Post } from "../../components/post";

import styles from "./styles.module.css";

export const Home = () => {
    const [posts, setPosts] = useState<TPost[]>([]);

    useEffect(() => {
        // with state manager all that shit will gone
        getAllPosts().then((data) => {
            setPosts(data);
        });
    }, []);
    return (
        <>
            <h1>Home</h1>
            <div className={styles.root}>
                {posts.map((post) => (
                    <Post
                        text={post.text}
                        authorId={post.authorId}
                        authorName={post.authorName}
                        id={post.id}
                    />
                ))}
            </div>
        </>
    );
};
