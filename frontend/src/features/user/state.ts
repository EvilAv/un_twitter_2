import { createEffect, createEvent, createStore, sample } from "effector";
import { User, UserLoginForm } from "./types";
import { getDataFromApiWithJWT } from "../request";
import { loginUserToApi } from "./lib/login-user-to-api";

export const $user = createStore<User | null>(null);
export const $isAuthenticated = $user.map((user) => Boolean(user));

export const userCleared = createEvent();
export const userLoginFormFilled = createEvent<UserLoginForm>();

export const getUserDataFx = createEffect(async() => {
    const data = await getDataFromApiWithJWT<User>("/profile");
    return data;
});

export const loginUserToApiFx = createEffect(async(params: UserLoginForm) => {
    const token = await loginUserToApi(params);
    return token;
})

sample({
    clock: userLoginFormFilled,
    target: loginUserToApiFx,
})

sample({
    source: loginUserToApiFx.doneData,
    filter: (token) => Boolean(token),
    target: getUserDataFx,
})

$user
    .on(getUserDataFx.doneData, (_, user) => user)
    .on(userCleared, () => null)

$user.watch(console.log)