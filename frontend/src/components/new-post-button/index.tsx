import React from "react";

import styles from "./styles.module.css";
import { useUnit } from "effector-react";
import { newPostModalOpened } from "../../features/modal/state";

export const NewPostButton = () => {
    const openModal = useUnit(newPostModalOpened);
    return (
        <div className={styles.root}>
            <button onClick={openModal} className={styles.btn}>
                +
            </button>
        </div>
    );
};
