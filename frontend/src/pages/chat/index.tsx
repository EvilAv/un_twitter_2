import { useUnit } from "effector-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import {
    $companion,
    $reversedMessages,
    dialogClosed,
    dialogSelected,
    getMessagesAborted,
    messagesLoaded,
} from "../../features/chat/state";
import { useForm, SubmitHandler } from "react-hook-form";
import { emptyStringValidator } from "../../features/forms/validators";
import { $user } from "../../features/user/state";
import styles from "./styles.module.css";
import SendIcon from "../../icons/send.svg";
import { encryptMessage } from "../../features/chat/libs/ecnrypt-message";
import { useInView } from "react-intersection-observer";
import { MessageList } from "../../components/message-list";

const ICON_SIZE = 25;

type MessageFormData = {
    text: string;
};

export const Chat = () => {
    const { id } = useParams();

    const selectDialog = useUnit(dialogSelected);
    const closeDialog = useUnit(dialogClosed);
    const loadMessages = useUnit(messagesLoaded);
    const abortMessages = useUnit(getMessagesAborted);

    const companion = useUnit($companion);
    const user = useUnit($user);
    const messages = useUnit($reversedMessages);

    const [pageIdx, setPageIdx] = useState(1);

    useEffect(() => {
        selectDialog(Number(id));
        loadMessages(0)

        return () => {
            closeDialog();
            abortMessages();
        };
    }, [id, selectDialog, closeDialog, loadMessages]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<MessageFormData>();

    const onSubmit: SubmitHandler<MessageFormData> = useCallback(
        (rawData) => {
            if (user && companion) {
                const msg = encryptMessage({
                    text: rawData.text,
                    private_key: user.private_key,
                    public_key: companion.public_key,
                });
                console.log(msg);
            }
            reset();
        },
        [user, companion]
    );

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            loadMessages(pageIdx);
            setPageIdx(pageIdx + 1);
        }
    }, [inView, setPageIdx]);

    if (!user || !companion) {
        return null;
    }

    return (
        <div className={styles.root}>
            <MessageList messages={messages} observerRef={ref} />
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <textarea
                    className={styles.input}
                    placeholder="Enter your message..."
                    {...register("text", {
                        required: "text - required field",
                        validate: { emptyStringValidator },
                    })}
                />
                <img
                    className={styles.btn}
                    src={SendIcon}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    onClick={() => handleSubmit(onSubmit)()}
                />
            </form>
        </div>
    );
};
