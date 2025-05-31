import React from "react";

import styles from "./styles.module.css";

type Props = {
    isMine: boolean;
    ref?: (node?: Element | null) => void;
    text: string;
    date: string;
};

export const MessageItem = ({ isMine, ref, text, date }: Props) => {
    return (
        <div className={styles.root} ref={ref}>
            <div
                className={
                    isMine
                        ? styles["mine-container"]
                        : styles["opposite-container"]
                }
            >
                <div
                    className={`${styles["message-container"]} ${
                        isMine ? styles.mine : styles.opposite
                    }`}
                >
                    <div className={styles.text}>{text}</div>
                    <div className={styles.date}>{date}</div>
                </div>
            </div>
        </div>
    );
};
