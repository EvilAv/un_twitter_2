import React, { useCallback } from "react";

import styles from "./styles.module.css";
import { useNavigate } from "react-router";
import { Logo } from "../logo";
import { useUnit } from "effector-react";
import {
    $isAuthenticated,
    $user,
    userCleared,
} from "../../features/user/state";

export const Header = () => {
    const navigate = useNavigate();
    const logout = useUnit(userCleared);
    const userData = useUnit($user);
    const isAuthenticated = useUnit($isAuthenticated);

    const onLoginClick = useCallback(() => {
        navigate("/login");
    }, []);

    const onLogoutClick = useCallback(() => {
        logout();
        navigate("/");
    }, []);

    const navigateToMyPosts = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        navigate("/my-posts");
    }, []);

    return (
        <header className={styles.root}>
            <div className={styles.user}>
                <Logo />
                {isAuthenticated && <div>{userData?.nickname}</div>}
            </div>
            {isAuthenticated ? (
                <button onClick={onLogoutClick}>logout</button>
            ) : (
                <button onClick={onLoginClick}>login</button>
            )}
        </header>
    );
};
