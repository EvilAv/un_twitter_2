import React, { useCallback } from "react";

import styles from "./styles.module.css";
import UserIcon from "../../icons/user.svg";
import { useNavigate } from "react-router";
import { Dialog as TDialog } from "../../features/chat/types";

const ICON_SIZE = 40;

type Props = {
    dialog: TDialog;
};

export const Dialog = ({ dialog }: Props) => {
    const navigate = useNavigate();
    const handleAvatarClick = useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            navigate(`/user/${dialog.userId}`);
        },
        [dialog, navigate]
    );

    return (
        <div
            className={styles.root}
            onClick={() => navigate(`/chat/${dialog.id}`)}
        >
            <img
                className={styles.avatar}
                src={UserIcon}
                width={ICON_SIZE}
                height={ICON_SIZE}
                onClick={handleAvatarClick}
            />
            <div>
                <div className={styles.nickname}>{dialog.userNickname}</div>
                <div className={styles.link} >
                    @{dialog.userLogin}
                </div>
            </div>
        </div>
    );
};
