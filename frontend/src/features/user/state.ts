import { createEffect, createEvent, createStore } from "effector";
import { User } from "./types";
import { getDataFromApiWithJWT } from "../request";

export const $user = createStore<User | null>(null);
export const $isAuthenticated = $user.map((user) => Boolean(user))

export const userCleared = createEvent();

export const getUserDataFx = createEffect(async() => {
    const data = await getDataFromApiWithJWT<User>("/profile");
    return data;
});

$user
    .on(getUserDataFx.doneData, (_, user) => user)
    .on(userCleared, () => null)

$user.watch(console.log)