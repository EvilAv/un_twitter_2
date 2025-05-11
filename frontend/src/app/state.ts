import { createEvent, sample } from "effector";
import { getUserDataFx, getUserFxAborted } from "../features/user/state";

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
