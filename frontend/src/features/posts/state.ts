import { createEffect, createEvent, createStore, sample } from "effector";
import { AddPostBody, TPost } from "./types";
import { requestFactory } from "../request";
import { showToast } from "../toasts";

export const $posts = createStore<TPost[]>([]);
export const $newPost = createStore<TPost | null>(null);

export const postsLoadingStarted = createEvent<number | undefined>();
export const newPostAdded = createEvent<string>();
export const postDeleted = createEvent<number>();
export const postsLoadingAborted = createEvent();

const getPosts = requestFactory<TPost[]>('get', '/post/all');
const postNewPost = requestFactory<TPost, AddPostBody>('post', '/post/create', true);
const deletePost = requestFactory<{}>('delete', '/post/delete', true);

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

export const deletePostFx = createEffect(async (postId: number) => {
    const request = deletePost.getRequest();
    await request({pathParams: String(postId)});
    return postId;
})

$posts
    .on(getPostsFx.doneData, (_, posts) => posts)
    .on(addNewPostFx.doneData, (state, newPost) => [...state, newPost])
    .on(deletePostFx.doneData, (state, deletedId) => state.filter(({id}) => id !== deletedId))

sample({
    clock: postDeleted,
    target: deletePostFx
})

sample({
    clock: deletePostFx.done,
    fn: () => showToast("success", "post was successfully deleted"),
});

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
