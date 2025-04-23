import { createEffect, createEvent, createStore, sample } from "effector";
import { TPost } from "./types";
import { getAllPosts } from "./lib/get-all-posts";
import { postDataToApiWithJWT } from "../request";
import { addNewPost } from "./lib/add-new-post";

export const $posts = createStore<TPost[]>([]);
export const $newPost = createStore<TPost | null>(null);

export const postsLoadingStarted = createEvent<number | undefined>();
export const newPostAdded = createEvent<string>();

export const getPostsFx = createEffect(async (userId?: number) => {
    const data = await getAllPosts(userId);
    return data;
});

export const addNewPostFx = createEffect(async (text: string) => {
    const data = await addNewPost(text);
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

