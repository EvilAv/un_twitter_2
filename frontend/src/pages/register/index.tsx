import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import style from './style.module.css'
import { useUnit } from "effector-react";
import { $isAuthenticated, userRegisterFormFilled } from "../../features/user/state";

// TODO: make some type generic for it
type RegisterFromData = {
    login: string | null;
    nickname: string | null;
    password1: string | null;
    password2: string | null;
};
// TODO: move to react forms
export const Register = () => {
    const [registerFormData, setRegisterFormData] = useState<RegisterFromData>({
        login: null,
        nickname: null,
        password1: null,
        password2: null,
    });
    const navigate = useNavigate();
    const isAuthenticated = useUnit($isAuthenticated);
    const register = useUnit(userRegisterFormFilled);

    useEffect(() => {
        if (isAuthenticated){
            navigate('/')
        }
    }, [isAuthenticated])

    // TODO: refactor that shit
    const onSubmit = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (
                registerFormData.login &&
                registerFormData.password1 &&
                registerFormData.nickname &&
                registerFormData.password2
            ) {
                if ( registerFormData.password1 !== registerFormData.password2){
                    // add toast here
                    window.alert('Passwords should match');
                    return;
                }
                register({
                    login: registerFormData.login,
                    nickname: registerFormData.nickname,
                    password1: registerFormData.password1,
                    password2: registerFormData.password2,
                });
            }
        },
        [registerFormData]
    );

        const onLoginChanged = useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = event.target;
                const login = value.trim();
    
                if (login || login.length > 0) {
                    setRegisterFormData({ ...registerFormData, login });
                }
                if (login.length === 0){
                    setRegisterFormData({ ...registerFormData, login: null });
                }
            },
            [setRegisterFormData, registerFormData]
        );
    
        const onPassword1Changed = useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = event.target;
                const password1 = value.trim();
    
                if (password1 || password1.length > 0) {
                    setRegisterFormData({ ...registerFormData, password1 });
                }
                if (password1.length === 0){
                    setRegisterFormData({ ...registerFormData, password1: null });
                }
            },
            [setRegisterFormData, registerFormData]
        );

        const onNicknameChanged = useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = event.target;
                const nickname = value.trim();
    
                if (nickname || nickname.length > 0) {
                    setRegisterFormData({ ...registerFormData, nickname });
                }
                if (nickname.length === 0){
                    setRegisterFormData({ ...registerFormData, nickname: null });
                }
            },
            [setRegisterFormData, registerFormData]
        );
    
        const onPassword2Changed = useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = event.target;
                const password2 = value.trim();
    
                if (password2 || password2.length > 0) {
                    setRegisterFormData({ ...registerFormData, password2 });
                }
                if (password2.length === 0){
                    setRegisterFormData({ ...registerFormData, password2: null });
                }
            },
            [setRegisterFormData, registerFormData]
        );

    return (
        <>
            <h1>Registration</h1>
            <form onSubmit={onSubmit} className={style.root}>
                <input
                    type="text"
                    placeholder="Login"
                    name="login"
                    value={registerFormData.login || ""}
                    onChange={onLoginChanged}
                />
                <input
                    type="text"
                    placeholder="Nickname"
                    name="nickname"
                    value={registerFormData.nickname || ""}
                    onChange={onNicknameChanged}
                />
                <input
                    type="password"
                    placeholder="Enter password"
                    name="password1"
                    value={registerFormData.password1 || ""}
                    onChange={onPassword1Changed}
                />
                <input
                    type="password"
                    placeholder="Repeat password"
                    name="password2"
                    value={registerFormData.password2 || ""}
                    onChange={onPassword2Changed}
                />
                <input type="submit" value="Register" />
            </form>
        </>
    );
};
