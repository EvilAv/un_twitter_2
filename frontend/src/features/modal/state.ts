import { createEvent, createStore } from "effector";

export const $isNewPostModalOpen = createStore(false);

export const newPostModalOpened = createEvent();
export const newPostModalClosed = createEvent();

$isNewPostModalOpen
    .on(newPostModalOpened, () => true)
    .on(newPostModalClosed, () => false);
