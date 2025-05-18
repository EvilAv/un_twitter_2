import { createEffect, createEvent, createStore, sample } from "effector";
import { AddPostBody, TPost } from "./types";
import { requestFactory } from "../request";

export const $posts = createStore<TPost[]>([]);
export const $newPost = createStore<TPost | null>(null);

export const postsLoadingStarted = createEvent<number | undefined>();
export const newPostAdded = createEvent<string>();
export const postsLoadingAborted = createEvent();

const getPosts = requestFactory<TPost[]>('get', '/post/all');
const postNewPost = requestFactory<TPost, AddPostBody>('post', '/post/create', true);

export const getPostsFx = createEffect(async (userId?: number) => {
    const request = getPosts.getRequest();
    const data = await request({queryParams: {user: userId}});
    return data;
});

export const addNewPostFx = createEffect(async (text: string) => {
    const request = postNewPost.getRequest();
    const data = await request({body: {text}});
    return data;
})

$posts
    .on(getPostsFx.doneData, (_, posts) => posts)
    .on(addNewPostFx.doneData, (state, newPost) => [...state, newPost])

sample({
    clock: postsLoadingStarted,
    target: getPostsFx,
});

sample({
    clock: newPostAdded,
    target: addNewPostFx,
})

sample({
    clock: postsLoadingAborted,
    fn: getPosts.abort
})
