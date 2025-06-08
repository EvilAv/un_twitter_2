import React, { useCallback, useEffect, useRef } from "react";

import styles from "./styles.module.css";
import { MessageItem } from "../message-item";
import { useUnit } from "effector-react";
import { $user } from "../../features/user/state";
import { Message } from "../../features/chat/types";
import { getEmotionIcon } from "../../features/emotion";

type Props = {
    observerRef: (node?: Element | null) => void;
    messages: Message[];
};

const ITEMS_BEFORE_LOAD = 3;

export const MessageList = ({ observerRef, messages }: Props) => {
    const endRef = useRef<HTMLDivElement>(null);
    const cachedLength = useRef<number>(0);

    useEffect(() => {
        if (endRef.current && messages.length !== cachedLength.current) {
            endRef.current.scrollIntoView(false);
        }
        if (messages.length > cachedLength.current){
            cachedLength.current = messages.length;
        }
    }, [endRef.current, messages, cachedLength.current]);


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
                        emotion={getEmotionIcon(msg.emotion)}
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
