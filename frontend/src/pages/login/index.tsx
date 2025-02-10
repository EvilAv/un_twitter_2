import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import style from './style.module.css'
import { useUnit } from "effector-react";
import { $isAuthenticated, userLoginFormFilled } from "../../features/user/state";

type LoginFormData = {
    login: string | null;
    password: string | null;
};

export const Login = () => {
    const [loginFormData, setLoginFormData] = useState<LoginFormData>({
        login: null,
        password: null,
    });
    const navigate = useNavigate();
    const login = useUnit(userLoginFormFilled);
    const isAuthenticated = useUnit($isAuthenticated);

    // TODO: refactor that shit
    const onSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (loginFormData.login && loginFormData.password) {
            login({
                login: loginFormData.login,
                password: loginFormData.password,
            })
        }
    }, [loginFormData]);

    useEffect(() => {
        if (isAuthenticated){
            navigate('/')
        }
    }, [isAuthenticated])

    const onLoginChanged = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const login = value.trim();

            if (login || login.length > 0) {
                setLoginFormData({ ...loginFormData, login });
            }
            if (login.length === 0){
                setLoginFormData({ ...loginFormData, login: null });
            }
        },
        [setLoginFormData, loginFormData]
    );

    const onPasswordChanged = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const password = value.trim();

            if (password || password.length > 0) {
                setLoginFormData({ ...loginFormData, password });
            }
            if (password.length === 0){
                setLoginFormData({ ...loginFormData, password: null });
            }
        },
        [setLoginFormData, loginFormData]
    );

    const navigateToRegisterPage = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        navigate('/register');
    }, []);

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={onSubmit} className={style.root}>
                <input
                    type="text"
                    placeholder="Login"
                    name="login"
                    value={loginFormData.login || ""}
                    onChange={onLoginChanged}
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={loginFormData.password || ""}
                    onChange={onPasswordChanged}
                />
                <input type="submit" value="Log in"/>
            </form>
            <a href='' onClick={navigateToRegisterPage} className={style.link}>make an account</a>
        </>
    );
};
