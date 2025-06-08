import { createEvent, sample } from "effector";
import { getUserDataFx, getUserFxAborted } from "../features/user/state";
import { getFinalModel, getJsonDictFx } from "../features/nets/state";

export const appStarted = createEvent();
export const startRequestsAborted = createEvent();

sample({
    clock: appStarted,
    target: getUserDataFx,
})

sample({
    clock: startRequestsAborted,
    target: getUserFxAborted
})

sample({
    clock: appStarted,
    target: getJsonDictFx,
})

sample({
    clock: appStarted,
    target: getFinalModel,
})
