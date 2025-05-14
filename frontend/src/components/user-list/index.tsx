import React from "react";
import { User } from "../../features/recomendations/types";
import { UserItem } from "../user-item";

import styles from './styles.module.css'

type Props = {
    users: User[];
};

export const UserList = ({ users }: Props) => {
    return (
        <div className={styles.root}>
            {users.map((user) => (
                <UserItem user={user} />
            ))}
        </div>
    );
};
