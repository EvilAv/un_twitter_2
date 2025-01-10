import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { loginToApi } from "../../features/login";

type LoginFormData = {
    login: string | null;
    password: string | null;
};

type Props = {
    onLogin: () => void;
};

export const Login = ({ onLogin }: Props) => {
    const [loginFormData, setLoginFormData] = useState<LoginFormData>({
        login: null,
        password: null,
    });
    const navigate = useNavigate();

    // TODO: refactor that shit
    const onSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (loginFormData.login && loginFormData.password) {
            const token = await loginToApi({
                login: loginFormData.login,
                password: loginFormData.password,
            });

            if (token) {
                onLogin();
                navigate("/");
            }
        }
    }, [loginFormData]);

    const onLoginChanged = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const login = value.trim();

            if (login || login.length > 0) {
                setLoginFormData({ ...loginFormData, login });
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
        },
        [setLoginFormData, loginFormData]
    );

    return (
        <>
            <div>Login</div>
            <form onSubmit={onSubmit}>
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
        </>
    );
};
