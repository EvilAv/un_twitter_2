import React, { useCallback } from "react";

type Props = {
    isAuthenticated: boolean;
    login?: string;
};

import styles from "./styles.module.css";
import { useNavigate } from "react-router";

export const Header = ({ isAuthenticated, login = "" }: Props) => {
    const navigate = useNavigate()

    const onLoginClick = useCallback(() => {
        navigate('/login');
    }, [])

    return <header className={styles.root}>
        {isAuthenticated && <div>{login}</div>}
        {isAuthenticated ? <button>logout</button> : <button onClick={onLoginClick}>login</button>}
    </header>;
};
