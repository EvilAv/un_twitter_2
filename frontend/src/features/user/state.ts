import { createEffect, createEvent, createStore, sample } from "effector";
import { User, UserLoginForm, UserRegisterForm } from "./types";
import { getDataFromApiWithJWT } from "../request";
import { loginUserToApi } from "./lib/login-user-to-api";
import { $errors } from "../errors/state";
import { registerUserToApi } from "./lib/register-user-to-api";
import { showToast } from "../toasts";
import { removeAuthToken } from "../request/lib/remove-auth-token";

export const $user = createStore<User | null>(null);
export const $isAuthenticated = $user.map((user) => Boolean(user));

export const userCleared = createEvent();
export const userLoginFormFilled = createEvent<UserLoginForm>();
export const userRegisterFormFilled = createEvent<UserRegisterForm>();

export const getUserDataFx = createEffect(async () => {
    const data = await getDataFromApiWithJWT<User>("/profile");
    return data;
});

export const loginUserToApiFx = createEffect(async (params: UserLoginForm) => {
    const user = await loginUserToApi(params);
    return user as User;
});

export const registerUserToApiFx = createEffect(
    async (params: UserRegisterForm) => {
        const user = await registerUserToApi(params);
        return user as User;
    }
);

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
    target: $errors,
});

sample({
    clock: getUserDataFx.failData,
    target: userCleared,
});

sample({
    clock: loginUserToApiFx.failData,
    fn: (error) => error.message,
    target: $errors,
});

sample({
    clock: registerUserToApiFx.failData,
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
