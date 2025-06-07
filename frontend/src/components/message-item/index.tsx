import React from "react";

import styles from "./styles.module.css";

type Props = {
    isMine: boolean;
    ref?: (node?: Element | null) => void;
    text: string;
    date: string;
    emotion: string;
};

export const MessageItem = ({ isMine, ref, text, date, emotion }: Props) => {
    return (
        <div className={styles.root} ref={ref}>
            <div
                className={
                    isMine
                        ? styles["mine-container"]
                        : styles["opposite-container"]
                }
            >
                {isMine && <div>{emotion}</div>}
                <div
                    className={`${styles["message-container"]} ${
                        isMine ? styles.mine : styles.opposite
                    }`}
                >
                    <div className={styles.text}>{text}</div>
                    <div className={styles.date}>{date}</div>
                </div>
                {!isMine && <div>{emotion}</div>}
            </div>
        </div>
    );
};
