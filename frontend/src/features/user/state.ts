import { createEffect, createEvent, createStore, sample } from "effector";
import { User, UserLoginForm, UserLoginResponse, UserRegisterForm } from "./types";
import { requestFactory } from "../request";
import { $errors } from "../errors/state";
import { showToast } from "../toasts";
import { removeAuthToken } from "../request/lib/remove-auth-token";
import { setAuthToken } from "../request/lib/set-auth-token";
import { DEFAULT_ABORTION_MESSAGE } from "../request/const";

export const $user = createStore<User | null>(null);
export const $isAuthenticated = $user.map((user) => Boolean(user));

export const userCleared = createEvent();
export const userLoginFormFilled = createEvent<UserLoginForm>();
export const userRegisterFormFilled = createEvent<UserRegisterForm>();
export const getUserFxAborted = createEvent();

const getUser = requestFactory<User>('get', '/profile', true);
const postLoginUser = requestFactory<UserLoginResponse, UserLoginForm>('post', '/login');
const postRegisterUser = requestFactory<UserLoginResponse, UserRegisterForm>('post', '/register');

export const getUserDataFx = createEffect(async () => {
    const request = getUser.getRequest()
    const data = await request();
    return data;
});

export const loginUserToApiFx = createEffect(async (params: UserLoginForm) => {
    const request = postLoginUser.getRequest()
    const user = await request(null, params);
    setAuthToken(user.token);
    return user as User;
});

export const registerUserToApiFx = createEffect(async (params: UserRegisterForm) => {
    const request = postRegisterUser.getRequest()
    const user = await request(null, params);
    setAuthToken(user.token);
    return user as User;
});

export const clearUserTokenFx = createEffect(removeAuthToken);

sample({
    clock: userLoginFormFilled,
    target: loginUserToApiFx,
});

sample({
    source: loginUserToApiFx.doneData,
    target: $user,
});

sample({
    clock: userRegisterFormFilled,
    target: registerUserToApiFx,
});

sample({
    source: registerUserToApiFx.doneData,
    target: $user,
});

$user
    .on(getUserDataFx.doneData, (_, user) => user)
    .on(userCleared, () => null);

sample({
    clock: userCleared,
    target: clearUserTokenFx,
});

$user.watch(console.log);

sample({
    clock: getUserDataFx.failData,
    fn: (error) => error.message,
    filter: (error) => error.message === DEFAULT_ABORTION_MESSAGE,
    target: $errors,
});

sample({
    clock: getUserDataFx.failData,
    filter: (error) => error.message === DEFAULT_ABORTION_MESSAGE,
    target: userCleared,
});

sample({
    clock: loginUserToApiFx.failData,
    filter: (error) => error.message === DEFAULT_ABORTION_MESSAGE,
    fn: (error) => error.message,
    target: $errors,
});

sample({
    clock: registerUserToApiFx.failData,
    filter: (error) => error.message === DEFAULT_ABORTION_MESSAGE,
    fn: (error) => error.message,
    target: $errors,
});

sample({
    clock: loginUserToApiFx.done,
    fn: () => showToast("success", "you successfully logged in"),
});

sample({
    clock: registerUserToApiFx.done,
    fn: () => showToast("success", "you successfully logged in"),
});

sample({
    clock: getUserFxAborted,
    fn: getUser.abort
})
