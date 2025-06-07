import React, { useEffect, useState } from "react";
import { PostItem } from "../../components/post-item";

import styles from "./styles.module.css";
import { useUnit } from "effector-react";
import {
    $posts,
    postListCleared,
    postsLoadingAborted,
    postsLoadingStarted,
} from "../../features/posts/state";
import { useInView } from "react-intersection-observer";

type Props = {
    userId?: number;
    canDelete?: boolean;
};

const needRef = (idx: number, maxPosts: number) => {
    if (maxPosts < 5) {
        return false;
    }
    return idx === maxPosts - 2;
};

export const PostList = ({ userId, canDelete }: Props) => {
    const { ref, inView } = useInView();
    const [pageIdx, setPageIdx] = useState(1);

    const loadPosts = useUnit(postsLoadingStarted);
    const abortLoading = useUnit(postsLoadingAborted);
    const clearPosts = useUnit(postListCleared);
    const posts = useUnit($posts);

    useEffect(() => {
        clearPosts();
        loadPosts({ userId, offset: 0 });

        return () => {
            abortLoading();
        };
    }, [userId]);

    useEffect(() => {
        if (inView) {
            loadPosts({ userId, offset: pageIdx });
            setPageIdx(pageIdx + 1);
        }

        return () => {
            abortLoading();
        };
    }, [inView, setPageIdx, userId]);

    return (
        <div className={styles.root}>
            {posts.length > 0 ? (
                posts.map((post, idx) => (
                    <PostItem
                        key={post.id}
                        text={post.text}
                        authorId={post.authorId}
                        authorName={post.authorName}
                        id={post.id}
                        authorLogin={post.authorLogin}
                        isLiked={post.isLiked}
                        likes={post.likes}
                        emotion={post.emotion}
                        ref={needRef(idx, posts.length) ? ref : undefined}
                        canBeDeleted={canDelete}
                        date={post.date}
                    />
                ))
            ) : (
                <div>:(</div>
            )}
        </div>
    );
};
