import { useUnit } from "effector-react";
import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router";
import {
    $companion,
    dialogClosed,
    dialogSelected,
} from "../../features/chat/state";
import { useForm, SubmitHandler } from "react-hook-form";
import { emptyStringValidator } from "../../features/forms/validators";
import { $user } from "../../features/user/state";
import styles from "./styles.module.css";
import SendIcon from "../../icons/send.svg";
import { encryptMessage } from "../../features/chat/libs/ecnrypt-message";

const ICON_SIZE = 40;

type MessageFormData = {
    text: string;
};

export const Chat = () => {
    const { id } = useParams();

    const selectDialog = useUnit(dialogSelected);
    const closeDialog = useUnit(dialogClosed);

    const companion = useUnit($companion);
    const user = useUnit($user);

    useEffect(() => {
        selectDialog(Number(id));

        return closeDialog;
    }, [id]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<MessageFormData>();

    const onSubmit: SubmitHandler<MessageFormData> = useCallback((rawData) => {
        console.log(rawData);
        if (user && companion){
            const msg = encryptMessage({
                text: rawData.text,
                private_key: user.private_key,
                public_key: companion.public_key
            })
            console.log(msg)
        }
        reset();
    }, []);

    if (!user || !companion) {
        return null;
    }

    return (
        <div className={styles.root}>
            <div>list</div>
            <form className={styles.form} onSubmit={e => e.preventDefault()}>
                <input
                    placeholder="Enter your message"
                    {...register("text", {
                        required: "text - required field",
                        validate: { emptyStringValidator },
                    })}
                />
                <img
                    src={SendIcon}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    onClick={() => handleSubmit(onSubmit)()}
                />
            </form>
        </div>
    );
};
