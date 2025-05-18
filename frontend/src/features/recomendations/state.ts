import { createEffect, createEvent, createStore, sample } from "effector";
import { Subscriptions, User } from "./types";
import { requestFactory } from "../request";
import { showToast } from "../toasts";

export const $subscriptions = createStore<User[]>([]);
export const $userInfo = createStore<User | null>(null);

export const subscriptionsLoaded = createEvent();
export const userLoaded = createEvent<number>();
export const unsubscribed = createEvent<number>();
export const subscribed = createEvent<number>();

const getUser = requestFactory<User>('get', '/recommendation/user');
const getSubscriptions = requestFactory<Subscriptions>('get', '/recommendation/subscriptions', true);
const postUnsubscribe = requestFactory<Subscriptions>('post', '/recommendation/unsubscribe', true);
const postSubscribe = requestFactory<Subscriptions>('post', '/recommendation/subscribe', true);

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

export const unsubscribeFx = createEffect(async (userId: number) => {
    const request = postUnsubscribe.getRequest();
    const data = await request({pathParams: String(userId)})
    return data;
});

export const subscribeFx = createEffect(async (userId: number) => {
    const request = postSubscribe.getRequest();
    const data = await request({pathParams: String(userId)})
    return data;
});

sample({
    clock: unsubscribed,
    target: unsubscribeFx
})

sample({
    clock: subscribed,
    target: subscribeFx
})

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

sample({
    clock: unsubscribeFx.doneData,
    fn: (subscriptions) => subscriptions.subscriptions,
    target: $subscriptions
})

sample({
    clock: unsubscribeFx.done,
    fn: () => showToast("success", "you successfully unsubscribe"),
});

sample({
    clock: subscribeFx.done,
    fn: () => showToast("success", "you successfully subscribe"),
});

sample({
    clock: subscribeFx.doneData,
    fn: (subscriptions) => subscriptions.subscriptions,
    target: $subscriptions
})

$subscriptions.watch((state) => console.log('user', state))