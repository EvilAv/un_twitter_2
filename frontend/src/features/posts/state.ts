import { createEffect, createEvent, createStore, sample } from "effector";
import { AddPostBody, TPost } from "./types";
import { requestFactory } from "../request";
import { showToast } from "../toasts";

export const $posts = createStore<TPost[]>([]);
export const $newPost = createStore<TPost | null>(null);

export const postsLoadingStarted = createEvent<number | undefined>();
export const newPostAdded = createEvent<string>();
export const postDeleted = createEvent<number>();
export const postLiked = createEvent<number>();
export const postUnliked = createEvent<number>();
export const postsLoadingAborted = createEvent();

const getPosts = requestFactory<TPost[]>("get", "/post/all", true);
const postNewPost = requestFactory<TPost, AddPostBody>(
    "post",
    "/post/create",
    true
);
const deletePost = requestFactory<{}>("delete", "/post/delete", true);
const postLikePost = requestFactory<{}>("post", "/recommendation/like", true);
const postUnlikePost = requestFactory<{}>("post", "/recommendation/unlike", true);

export const getPostsFx = createEffect(async (userId?: number) => {
    const request = getPosts.getRequest();
    const data = await request({ queryParams: { user: userId } });
    return data;
});

export const addNewPostFx = createEffect(async (text: string) => {
    const request = postNewPost.getRequest();
    const data = await request({ body: { text } });
    return data;
});

export const deletePostFx = createEffect(async (postId: number) => {
    const request = deletePost.getRequest();
    await request({ pathParams: String(postId) });
    return postId;
});

export const likePostFx = createEffect(async (postId: number) => {
    const request = postLikePost.getRequest();
    await request({ pathParams: String(postId) });
    return postId;
});

export const unlikePostFx = createEffect(async (postId: number) => {
    const request = postUnlikePost.getRequest();
    await request({ pathParams: String(postId) });
    return postId;
});

$posts
    .on(getPostsFx.doneData, (_, posts) => posts)
    .on(addNewPostFx.doneData, (state, newPost) => [...state, newPost])
    .on(deletePostFx.doneData, (state, deletedId) =>
        state.filter(({ id }) => id !== deletedId)
    )
    .on(likePostFx.doneData, (state, postId) => {
        const idx = state.findIndex(({ id }) => id === postId);

        if (idx !== -1) {
            const a = state[idx];
            a.isLiked = true;
            if (a.likes === undefined) {
                a.likes = 0;
            }
            a.likes += 1;

            return [...state.slice(0, idx), a, ...state.slice(idx + 1)];
        }
    })
    .on(unlikePostFx.doneData, (state, postId) => {
        const idx = state.findIndex(({ id }) => id === postId);

        if (idx !== -1) {
            const a = state[idx];
            a.isLiked = false;
            if (a.likes === undefined) {
                a.likes = 1;
            }
            a.likes -= 1;

            return [...state.slice(0, idx), a, ...state.slice(idx + 1)];
        }
    })
    .on(postsLoadingStarted, () => []);

sample({
    clock: postDeleted,
    target: deletePostFx,
});

sample({
    clock: postLiked,
    target: likePostFx,
});

sample({
    clock: postUnliked,
    target: unlikePostFx,
});

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
});

sample({
    clock: postsLoadingAborted,
    fn: getPosts.abort,
});
