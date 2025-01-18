import React, { useCallback, useState } from "react";
import { PostList } from "../../components/post-list";

import styles from "./style.module.css";
import { postRequestToApiWithJWT } from "../../features/request";
import { PostFrom, PostResponse } from "./types";
import { TPost } from "../../features/posts/types";

type Props = {
    userId: number;
    userName: string;
};

export const MyPosts = ({ userId, userName }: Props) => {
    const [isPublishMode, setIsPublishMode] = useState(false);
    const [text, setText] = useState("");

    const [newPosts, setNewPosts] = useState<TPost[]>([]);

    const onSubmit = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (text.trim().length > 0) {
                const result = await postRequestToApiWithJWT<
                    PostFrom,
                    PostResponse
                >("/post/create", {
                    text: text.trim(),
                });
                if (result && result.status === "ok") {
                    setNewPosts([...newPosts, {
                        id: result.id,
                        text: text.trim(),
                        authorId: userId,
                        authorName: userName,
                    }])
                    setText('');
                    setIsPublishMode(false)
                }
            }
        },
        [text, newPosts, setNewPosts, setText]
    );

    const onTextChanged = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const { value } = event.target;
            const rawText = value;

            setText(rawText);
        },
        [setText]
    );

    return (
        <>
            <h1>My posts</h1>
            <PostList userId={userId} newPosts={newPosts}/>
            {!isPublishMode && (
                <button
                    className={styles.btn}
                    onClick={() => setIsPublishMode(true)}
                >
                    + new post
                </button>
            )}
            {isPublishMode && (
                <form className={styles.form} onSubmit={onSubmit}>
                    <textarea
                        name="text"
                        placeholder="Write something..."
                        rows={3}
                        onChange={onTextChanged}
                        value={text}
                    ></textarea>
                    <div className={styles.btnGroup}>
                        <input type="submit" value="Publish" />
                        <button onClick={() => setIsPublishMode(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </>
    );
};
