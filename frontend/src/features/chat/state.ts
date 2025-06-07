import { createEffect, createEvent, createStore, sample } from "effector";
import {
    Dialog,
    DialoguesResponse,
    Message,
    RawMessage,
    UserWithKey,
} from "./types";
import { requestFactory } from "../request";
import { BATCH_SIZE } from "./const";
import { $user } from "../user/state";
import { decryptRawMessage } from "./libs/decrypt-raw-message";
import { User } from "../user/types";

export const $dialogues = createStore<Dialog[]>([]);
export const $selectedDialog = createStore<Dialog | null>(null);
export const $companion = createStore<UserWithKey | null>(null);
export const $messages = createStore<Message[]>([]);

export const dialoguesLoaded = createEvent();
export const dialogSelected = createEvent<number>();
export const dialogClosed = createEvent();
export const getDialoguesAborted = createEvent();
export const getMessagesAborted = createEvent();
export const messagesLoaded = createEvent<number>();
export const oneMessageLoaded = createEvent<RawMessage>();

export const onePureMessageLoaded = createEvent<Message>();
export const pureMessagesLoaded = createEvent<Message[]>();

export const dialogStarted = createEvent<number>();

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
const getMessages = requestFactory<RawMessage[]>("get", "/chat/messages", true);

const postStartDialog = requestFactory<DialoguesResponse>(
    "post",
    "/chat/start-dialog",
    true
);

export const postStartDialogFx = createEffect(async (userId: number) => {
    const request = postStartDialog.getRequest();
    await request({ pathParams: String(userId) });
});

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

export const getMessagesFx = createEffect(
    async ([dialogId, offset]: [number, number]) => {
        const request = getMessages.getRequest();
        const data = await request({ pathParams: `${dialogId}/${offset}` });
        return data;
    }
);

$messages
    .on(pureMessagesLoaded, (state, newMessages) => [...newMessages, ...state])
    .on(dialogClosed, () => [])
    .on(onePureMessageLoaded, (state, message) => [...state, message]);

// hell part, but we just take users from stores and do some decryption
// and then trigger event to update store with decrypted (pure) messages
sample({
    clock: getMessagesFx.doneData,
    source: [$user, $companion],
    filter: ([user, user2]) => Boolean(user && user2),
    fn: ([user1, user2], messages) =>
        messages
            .map((msg) =>
                decryptRawMessage(user1 as User, user2 as UserWithKey, msg)
            )
            .reverse(),
    target: pureMessagesLoaded,
});

sample({
    clock: dialogStarted,
    target: postStartDialogFx,
});

sample({
    clock: oneMessageLoaded,
    source: [$user, $companion],
    filter: ([user, user2], message) => Boolean(user && user2 && message),
    fn: ([user1, user2], message) =>
        decryptRawMessage(user1 as User, user2 as UserWithKey, message),
    target: onePureMessageLoaded,
});

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
