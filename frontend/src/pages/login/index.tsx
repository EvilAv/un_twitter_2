import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { loginToApi } from "../../features/login";
import { getDataFromApiWithJWT } from "../../features/request";

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

            const token = await loginToApi({
                login: loginData.login,
                password: loginData.password
            });

            if (token){
                console.log('message')
                navigate('/');
                const a = await getDataFromApiWithJWT<any>('/profile')
                console.log(a);
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
