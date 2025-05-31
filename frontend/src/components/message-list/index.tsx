import React, { useCallback, useEffect, useRef } from "react";

import styles from "./styles.module.css";
import { MessageItem } from "../message-item";
import { useUnit } from "effector-react";
import { $user } from "../../features/user/state";
import { Message } from "../../features/chat/types";

type Props = {
    observerRef: (node?: Element | null) => void;
    messages: Message[];
};

const ITEMS_BEFORE_LOAD = 3;

export const MessageList = ({ observerRef, messages }: Props) => {
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView(false);
        }
    }, [endRef.current, messages]);


    const user = useUnit($user);

    if (!user){
        return null;
    }

    return (
        <div className={styles.root}>
            <div className={styles.scrollable}>
                {messages.map((msg, idx) => (
                    <MessageItem
                        isMine={msg.authorId === user.id}
                        text={msg.text}
                        date={msg.date}
                        key={idx}
                        ref={
                            idx === ITEMS_BEFORE_LOAD ? observerRef : undefined
                        }
                    />
                ))}
                <div ref={endRef} />
            </div>
        </div>
    );
};
