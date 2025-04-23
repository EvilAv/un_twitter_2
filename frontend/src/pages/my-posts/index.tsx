import React, { useCallback, useState } from "react";
import { PostList } from "../../components/post-list";
import { useForm, SubmitHandler } from "react-hook-form";

import styles from "./style.module.css";
import { emptyStringValidator } from "../../features/forms/validators";
import { useUnit } from "effector-react";
import { newPostAdded } from "../../features/posts/state";
import { $user } from "../../features/user/state";


type NewPostFormData = {
    text: string;
};

export const MyPosts = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<NewPostFormData>();

    const user = useUnit($user);

    const addNewPost = useUnit(newPostAdded);
    const [isPublishMode, setIsPublishMode] = useState(false);

    const onSubmit: SubmitHandler<NewPostFormData> = useCallback((data) => {
        console.log(data);
        addNewPost(data.text);
        setIsPublishMode(false);
        reset();
    }, []);

    if (!user){
        return null;
    }

    return (
        <>
            <h1>My posts</h1>
            <PostList userId={user.id} />
            {!isPublishMode && (
                <button
                    className={styles.btn}
                    onClick={() => setIsPublishMode(true)}
                >
                    + new post
                </button>
            )}
            {isPublishMode && (
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <textarea
                        placeholder="Write something..."
                        rows={3}
                        {...register("text", {
                            required: "text - required field",
                            validate: { emptyStringValidator },
                        })}
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
