import React, { useCallback, useState } from "react";
import { loginToApi } from "../../features/request";
import { useNavigate } from "react-router";

type LoginData = {
    login: string | null;
    password: string | null;
};

export const Login = () => {
    const [loginData, setLoginData] = useState<LoginData>({ login: null, password: null });
    const navigate = useNavigate();

    // TODO: refactor that shit
    const onSubmit = useCallback(async() => {
        if (loginData.login && loginData.password){

            const isAuthenticated = await loginToApi(loginData.login, loginData.password);

            if (isAuthenticated){
                console.log('message')
                navigate('/');
            }
        }
    }, [loginData]);

    const onLoginChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const login = value.trim();

        if (login || login.length > 0){
            setLoginData({...loginData, login})
        }
    }, [setLoginData, loginData])

    const onPasswordChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const password = value.trim();

        if (password || password.length > 0){
            setLoginData({...loginData, password})
        }
    }, [setLoginData, loginData])

    return (
        <>
            <div>Login</div>
            <input onChange={onLoginChanged} type="text" placeholder="Login" />
            <input onChange={onPasswordChanged} type="text" placeholder="Password" />
            <button onClick={onSubmit}>submit</button>
        </>
    );
};