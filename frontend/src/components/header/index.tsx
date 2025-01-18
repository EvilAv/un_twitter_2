import React, { useCallback, useEffect, useState } from "react";

type Props = {
    isAuthenticated: boolean;
    onLogout: () => void;
    nickname: string;
};

import styles from "./styles.module.css";
import { useNavigate } from "react-router";
import { Logo } from "../logo";

export const Header = ({ isAuthenticated, onLogout, nickname }: Props) => {
    const navigate = useNavigate();

    const onLoginClick = useCallback(() => {
        navigate("/login");
    }, []);

    const onLogoutClick = useCallback(() => {
        localStorage.removeItem("auth_token");
        onLogout();
    }, []);

    const navigateToMyPosts = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        navigate("/my-posts");
    }, []);

    return (
        <header className={styles.root}>
            <Logo />
            {isAuthenticated && <div>{nickname}</div>}
            {isAuthenticated && <a href="" onClick={navigateToMyPosts}>my posts</a>}
            {isAuthenticated ? (
                <button onClick={onLogoutClick}>logout</button>
            ) : (
                <button onClick={onLoginClick}>login</button>
            )}
        </header>
    );
};
