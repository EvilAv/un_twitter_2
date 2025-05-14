import { createEffect, createEvent, createStore, sample } from "effector";
import { Subscriptions, User } from "./types";
import { requestFactory } from "../request";

export const $subscriptions = createStore<User[]>([]);
export const $userInfo = createStore<User | null>(null);

export const subscriptionsLoaded = createEvent();
export const userLoaded = createEvent<number>();

const getUser = requestFactory<User>('get', '/recommendation/user');
const getSubscriptions = requestFactory<Subscriptions>('get', '/recommendation/subscriptions', true);
// const postNewPost = requestFactory<TPost, AddPostBody>('post', '/post/create');

export const getUserFx = createEffect(async (userId: number) => {
    const request = getUser.getRequest();
    const data = await request({pathParams: String(userId)})
    return data;
});

export const getSubscriptionsFx = createEffect(async () => {
    const request = getSubscriptions.getRequest();
    const data = await request({})
    return data;
});

sample({
    clock: userLoaded,
    target: getUserFx,
});

sample({
    clock: getUserFx.doneData,
    target: $userInfo
})

sample({
    clock: subscriptionsLoaded,
    target: getSubscriptionsFx,
});

sample({
    clock: getSubscriptionsFx.doneData,
    fn: (subscriptions) => subscriptions.subscriptions,
    target: $subscriptions
})

$subscriptions.watch((state) => console.log('user', state))