import { useUnit } from "effector-react";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import {
    $companion,
    $messages,
    $selectedDialog,
    dialogClosed,
    dialogSelected,
    getMessagesAborted,
    messagesLoaded,
    oneMessageLoaded,
} from "../../features/chat/state";
import { useForm, SubmitHandler } from "react-hook-form";
import { emptyStringValidator } from "../../features/forms/validators";
import { $user } from "../../features/user/state";
import styles from "./styles.module.css";
import SendIcon from "../../icons/send.svg";
import { encryptMessage } from "../../features/chat/libs/ecnrypt-message";
import { useInView } from "react-intersection-observer";
import { MessageList } from "../../components/message-list";
import { getSocket } from "../../features/chat/socket";
import { Socket } from "socket.io-client";
import { handleError } from "./handlers";
import { MessageToSend } from "../../features/chat/types";
import { wordToVector } from "../../features/emotion/lib/preproces";
import { $finalModel, $jsonDict } from "../../features/nets/state";
import * as tf from "@tensorflow/tfjs";
import { getEmotionFromPredict } from "../../features/emotion";

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
    const messages = useUnit($messages);
    const dialog = useUnit($selectedDialog);
    const dict = useUnit($jsonDict);
    const model = useUnit($finalModel);

    const addMessage = useUnit(oneMessageLoaded);

    const [pageIdx, setPageIdx] = useState(1);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        selectDialog(Number(id));
        loadMessages(0);

        if (socket && dialog) {
            socket.connect();
            socket.emit("join", dialog.id);
        } else {
            setSocket(getSocket());
        }

        return () => {
            closeDialog();
            abortMessages();
            if (socket) {
                socket.disconnect();
            }
        };
    }, [id, selectDialog, closeDialog, loadMessages, socket, dialog]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<MessageFormData>();

    const onSubmit: SubmitHandler<MessageFormData> = useCallback(
        (rawData) => {
            if (user && companion && socket && dict && model) {
                const tensor = wordToVector(dict, rawData.text);

                const result = model.predict(tensor) as tf.Tensor2D;
                const arr = result.arraySync() as number[][];
                console.log(arr)

                const msg: MessageToSend = {
                    ...encryptMessage({
                        text: rawData.text,
                        private_key: user.private_key,
                        public_key: companion.public_key,
                        mine_public_key: user.public_key,
                    }),
                    authorId: user.id,
                    emotion: getEmotionFromPredict(arr[0]),
                };
                socket.emit("send-message", msg);
            }
            reset();
        },
        [user, companion, socket, dict, model]
    );

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            loadMessages(pageIdx);
            setPageIdx(pageIdx + 1);
        }
    }, [inView, setPageIdx]);

    useEffect(() => {
        if (socket) {
            socket.on("error", handleError);
            socket.on("receive-message", addMessage);
        }

        return () => {
            socket?.off("error", handleError);
            socket?.off("receive-message", addMessage);
        };
    }, [socket]);

    if (!user || !companion) {
        return null;
    }

    if (!socket) {
        return <p>:( Chat is unavailable</p>;
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
