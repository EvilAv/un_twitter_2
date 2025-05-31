import { useUnit } from "effector-react";
import React, { useEffect } from "react";
import { $dialogues, dialoguesLoaded, getDialoguesAborted } from "../../features/chat/state";
import { Dialog } from "../../components/dialog";

export const Chats = () => {
    const loadDialogues = useUnit(dialoguesLoaded);
    const abortDialogues = useUnit(getDialoguesAborted);
    const dialogues = useUnit($dialogues);

    useEffect(() => {
        loadDialogues();
        return abortDialogues;
    }, []);

    return (
        <>
            {dialogues.map((dialog, idx) => (
                <Dialog dialog={dialog} key={idx}/>
            ))}
        </>
    );
};
