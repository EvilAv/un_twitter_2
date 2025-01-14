import React, { useCallback, useEffect, useState } from "react";

type Props = {
    isAuthenticated: boolean;
    onLogout: () => void;
    onLogin: () => void;
};

type Data = {
    nickname: string;
}

import styles from "./styles.module.css";
import { useNavigate } from "react-router";
import { getDataFromApiWithJWT } from "../../features/request";
import { Logo } from "../logo";

export const Header = ({ isAuthenticated, onLogout, onLogin}: Props) => {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState<string | null>(null);

    useEffect(() => {
        async function getData() {
            const data = await getDataFromApiWithJWT<Data>('/profile');
            if (data){
                setNickname(data.nickname);
                onLogin();
            }
        }
        getData();
    }, [isAuthenticated, onLogin])

    const onLoginClick = useCallback(() => {
        navigate("/login");
    }, []);

    const onLogoutClick = useCallback(() => {
        localStorage.removeItem("auth_token");
        onLogout();
    }, []);

    return (
        <header className={styles.root}>
            <Logo />
            {isAuthenticated && <div>{nickname}</div>}
            {isAuthenticated ? (
                <button onClick={onLogoutClick}>logout</button>
            ) : (
                <button onClick={onLoginClick}>login</button>
            )}
        </header>
    );
};
