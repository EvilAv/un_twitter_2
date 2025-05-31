import { createEffect, createEvent, createStore, sample } from "effector";
import { Dialog, DialoguesResponse, Message, UserWithKey } from "./types";
import { requestFactory } from "../request";
import { BATCH_SIZE } from "./const";

export const $dialogues = createStore<Dialog[]>([]);
export const $selectedDialog = createStore<Dialog | null>(null);
export const $companion = createStore<UserWithKey | null>(null);
export const $pureMessages = createStore<Message[]>([]);

export const dialoguesLoaded = createEvent();
export const dialogSelected = createEvent<number>();
export const dialogClosed = createEvent();
export const getDialoguesAborted = createEvent();
export const getMessagesAborted = createEvent();
export const messagesLoaded = createEvent<number>();

export const $reversedMessages = $pureMessages.map(state => state.reverse());

const getDialogues = requestFactory<DialoguesResponse>(
    "get",
    "/chat/dialogues",
    true
);
const getUser = requestFactory<UserWithKey>(
    "get",
    "/recommendation/user",
    true
);
const getMessages = requestFactory<Message[]>("get", "/chat/messages", true);

export const getDialoguesFx = createEffect(async () => {
    const request = getDialogues.getRequest();
    const data = await request({});
    return data.dialogues;
});

export const getUserFx = createEffect(async (id: number) => {
    const request = getUser.getRequest();
    const data = await request({ pathParams: String(id) });
    return data;
});

// will reverse array here, we will got array from back, where first item
// is the newest, and then we will reverse array here, needs derived store i guess
export const getMessagesFx = createEffect(
    async ([dialogId, offset]: [number, number]) => {
        const request = getMessages.getRequest();
        const data = await request({ pathParams: `${dialogId}/${offset}` });
        return data;
    }
);

$pureMessages
    .on(getMessagesFx.doneData, (state, newMessages) => [
        ...state,
        ...newMessages,
    ])
    .on(dialogClosed, () => []);

$pureMessages.watch(console.log);

sample({
    clock: getDialoguesAborted,
    fn: getDialogues.abort,
});

sample({
    clock: getMessagesAborted,
    fn: getMessages.abort,
});

sample({
    clock: dialoguesLoaded,
    target: getDialoguesFx,
});

$dialogues.on(getDialoguesFx.doneData, (_, data) => data);

$selectedDialog.on(dialogClosed, () => null);

$companion
    .on(getUserFx.doneData, (_, data) => data)
    .on(dialogClosed, () => null);

sample({
    clock: messagesLoaded,
    source: $selectedDialog,
    filter: (dialog): dialog is Dialog => dialog !== null,
    fn: (dialog, offset) =>
        [dialog!.id, offset * BATCH_SIZE] as [number, number],
    target: getMessagesFx,
});

sample({
    clock: dialogSelected,
    source: $dialogues,
    fn: (dialogues, id) => dialogues.find((d) => d.id === id) ?? null,
    target: $selectedDialog,
});

sample({
    clock: $selectedDialog,
    filter: (dialog): dialog is Dialog => dialog !== null,
    fn: (dialog) => dialog!.userId,
    target: getUserFx,
});
