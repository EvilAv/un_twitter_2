import { createEvent, createStore, sample } from "effector";
import { UnauthorizedError } from "./types";

export const $errors = createStore<string | null>(null);
export const toastFired = createEvent<string>();

$errors.watch(console.log)

sample({
    source: $errors,
    filter: (error): error is string => Boolean(error) && error !== UnauthorizedError,
    target: toastFired,
})

sample({
    clock: toastFired,
    fn: (data) => console.log('toast', data),
})
