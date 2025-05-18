import { LayersModel } from "@tensorflow/tfjs";
import { createEffect, createEvent, createStore, sample } from "effector";
import { getModel } from ".";

export const $testModel = createStore<LayersModel | null>(null);

export const testModelRequested = createEvent();

export const getTestModelFx = createEffect(async () => {
    const model = await getModel('test');
    return model;
});

sample({
    clock: testModelRequested,
    target: getTestModelFx,
});

sample({
    clock: getTestModelFx.doneData,
    target: $testModel,
});
