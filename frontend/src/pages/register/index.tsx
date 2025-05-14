import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import styles from './styles.module.css'
import { useUnit } from "effector-react";
import { $isAuthenticated, userRegisterFormFilled } from "../../features/user/state";
import { SubmitHandler, useForm } from "react-hook-form";
import { emptyStringValidator } from "../../features/forms/validators";

// TODO: make some type generic for it
type RegisterFormData = {
    login: string;
    nickname: string;
    password1: string;
    password2: string;
};
// TODO: move to react forms
export const Register = () => {
    const {register, handleSubmit, formState: { errors }, reset} = useForm<RegisterFormData>();

    const onSubmit: SubmitHandler<RegisterFormData> = useCallback((data) => {
        console.log(data);
        if (data.password1 !== data.password2){
            reset();
            // add toast here
            window.alert('Passwords should match');
        }
        registerUser({
            login: data.login,
            nickname: data.nickname,
            password1: data.password1,
            password2: data.password2,
        });
    }, [])

    const navigate = useNavigate();
    const isAuthenticated = useUnit($isAuthenticated);
    const registerUser = useUnit(userRegisterFormFilled);

    useEffect(() => {
        if (isAuthenticated){
            navigate('/')
        }
    }, [isAuthenticated])

    return (
        <div className={styles.root}>
            <h1>Registration</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <input
                    type="text"
                    placeholder="Login"
                    {...register('login', {
                        required: 'login - required field',
                        validate: { emptyStringValidator }
                    } )}
                />
                <input
                    type="text"
                    placeholder="Nickname"
                    {...register('nickname', {
                        required: 'nickname - required field',
                        validate: { emptyStringValidator }
                    } )}
                />
                <input
                    type="password"
                    placeholder="Enter password"
                    {...register('password1', {
                        required: 'password - required field',
                        validate: { emptyStringValidator }
                    } )}
                />
                <input
                    type="password"
                    placeholder="Repeat password"
                    {...register('password2', {
                        required: 'password - required field',
                        validate: { emptyStringValidator }
                    } )}
                />
                <div>{errors.login?.message}</div>
                <div>{errors.nickname?.message}</div>
                <div>{errors.password1?.message}</div>
                <div>{errors.password2?.message}</div>
                <input type="submit" value="Register" />
            </form>
        </div>
    );
};
