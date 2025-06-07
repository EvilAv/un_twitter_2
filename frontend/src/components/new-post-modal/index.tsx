import React, { useCallback } from "react";

import styles from "./styles.module.css";
import { useUnit } from "effector-react";
import {
    $isNewPostModalOpen,
    newPostModalClosed,
} from "../../features/modal/state";
import { SubmitHandler, useForm } from "react-hook-form";
import { newPostAdded } from "../../features/posts/state";
import { emptyStringValidator } from "../../features/forms/validators";

type NewPostFormData = {
    text: string;
};

export const NewPostModal = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<NewPostFormData>();

    const onSubmit: SubmitHandler<NewPostFormData> = useCallback((data) => {
        console.log(data);
        addNewPost(data.text);
        reset();
    }, []);

    const isOpened = useUnit($isNewPostModalOpen);
    const closeModal = useUnit(newPostModalClosed);

    const addNewPost = useUnit(newPostAdded);

    if (!isOpened) {
        return null;
    }

    return (
        <div className={styles.modal} onClick={closeModal}>
            <div
                className={styles.root}
                onClick={(event) => event.stopPropagation()}
            >
                <div className={styles.header}>Add new post</div>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <textarea
                        className={styles.input}
                        placeholder="Write something..."
                        rows={3}
                        {...register("text", {
                            required: "text - required field",
                            validate: { emptyStringValidator },
                        })}
                    ></textarea>
                    <div className={styles.btnGroup}>
                        <input type="submit" value="Publish" />
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
