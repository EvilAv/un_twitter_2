import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm, SubmitHandler } from "react-hook-form"

import style from './style.module.css'
import { useUnit } from "effector-react";
import { $isAuthenticated, userLoginFormFilled } from "../../features/user/state";
import { emptyStringValidator } from "../../features/forms/validators";

type LoginFormData = {
    login: string;
    password: string;
};


export const Login = () => {
    const {register, handleSubmit, formState: { errors },} = useForm<LoginFormData>();
    const onSubmit: SubmitHandler<LoginFormData> = (data) => {
        console.log(data)
        login({
            login: data.login,
            password: data.password,
        })
    }

    const navigate = useNavigate();
    const login = useUnit(userLoginFormFilled);
    const isAuthenticated = useUnit($isAuthenticated);

    useEffect(() => {
        if (isAuthenticated){
            navigate('/')
        }
    }, [isAuthenticated])


    const navigateToRegisterPage = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        navigate('/register');
    }, []);

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={style.root}>
                <input
                    type="text"
                    placeholder="Login"
                    {...register('login', {
                        required: 'login - required field',
                        validate: { emptyStringValidator }
                    } )}
                />
                <input
                    type="password"
                    placeholder="Password"
                    {...register('password', {
                        required: 'password - required field', 
                        validate: { emptyStringValidator }
                    } )}
                    // the variant below doesnt contain any text info about error, but maybe it is what we need 
                    // {...register('password', {required: 'required field'} )}
                />
                <div>{errors.login?.message}</div>
                <div>{errors.password?.message}</div>
                <input type="submit" value="Log in"/>
            </form>
            <a href='' onClick={navigateToRegisterPage} className={style.link}>make an account</a>
        </>
    );
};
