import { useUnit } from "effector-react";
import React, { useEffect } from "react";
import { $dialogues, dialoguesLoaded } from "../../features/chat/state";
import { Dialog } from "../../components/dialog";

export const Chats = () => {
    const loadDialogues = useUnit(dialoguesLoaded);
    const dialogues = useUnit($dialogues);

    useEffect(() => {
        loadDialogues();
    }, []);

    return (
        <>
            {dialogues.map((dialog, idx) => (
                <Dialog dialog={dialog} />
            ))}
        </>
    );
};
