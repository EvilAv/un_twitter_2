import { createEvent, sample } from "effector";
import { getUserDataFx } from "../features/user/state";

export const appStarted = createEvent();

sample({
    clock: appStarted,
    target: getUserDataFx,
})
