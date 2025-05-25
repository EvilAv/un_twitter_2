import { createEffect, createEvent, createStore, sample } from "effector";
import { Dialog, DialoguesResponse, UserWithKey} from "./types";
import { requestFactory } from "../request";
import { showToast } from "../toasts";

export const $dialogues = createStore<Dialog[]>([]);
export const $selectedDialog = createStore<Dialog | null>(null);
export const $companion = createStore<UserWithKey | null>(null);

export const dialoguesLoaded = createEvent();
export const dialogSelected = createEvent<number>();
export const dialogClosed = createEvent();

const getDialogues = requestFactory<DialoguesResponse>("get", "/chat/dialogues", true);
const getUser = requestFactory<UserWithKey>("get", "/recommendation/user", true);

export const getDialoguesFx = createEffect(async () => {
    const request = getDialogues.getRequest();
    const data = await request({});
    return data.dialogues;
});

export const getUserFx = createEffect(async (id: number) => {
    const request = getUser.getRequest();
    const data = await request({pathParams: String(id)});
    return data;
});

sample({
    clock: dialoguesLoaded,
    target: getDialoguesFx,
});

$dialogues.on(getDialoguesFx.doneData, (_, data) => data);

$selectedDialog
    .on(dialogClosed, () => null)

$companion.on(getUserFx.doneData, (_, data) => data);

sample({
    clock: dialogSelected,
    source: $dialogues,
    fn: (dialogues, id) => dialogues.find(d => d.id === id) ?? null,
    target: $selectedDialog
})

sample({
    clock: $selectedDialog,
    filter: (dialog): dialog is Dialog => dialog !== null,
    fn: (dialog) => dialog!.userId,
    target: getUserFx
})
