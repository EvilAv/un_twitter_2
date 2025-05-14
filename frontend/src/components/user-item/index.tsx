import React, { useEffect, useState } from "react";
import { User } from "../../features/recomendations/types";

import styles from './styles.module.css'
import UserIcon from '../../icons/user.svg'
import { useNavigate } from "react-router";

const ICON_SIZE = 50;

type Props = {
    user: User;
}

export const UserItem = ({user}: Props) => {

    const navigate = useNavigate();
    return (
        <div className={styles.root} onClick={() => navigate(`/user/${user.id}`)}>
            <img className={styles.avatar} src={UserIcon} width={ICON_SIZE} height={ICON_SIZE} />
            <div>
                <div className={styles.nickname}>{user.nickname}</div>
                <div>@{user.login}</div>
            </div>
        </div>
    );
};
