import { LayersModel } from "@tensorflow/tfjs";
import { createEffect, createEvent, createStore, sample } from "effector";
import { getModel } from ".";

export const $testModel = createStore<LayersModel | null>(null);
export const $testWord2vecModel = createStore<LayersModel | null>(null);

export const testModelRequested = createEvent();
export const testWord2vecModelRequested = createEvent();

export const getTestModelFx = createEffect(async () => {
    const model = await getModel('test');
    return model;
});

export const getTestWord2vecModelFx = createEffect(async () => {
    const model = await getModel('test-word2vec');
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

sample({
    clock: testWord2vecModelRequested,
    target: getTestWord2vecModelFx,
});

sample({
    clock: getTestWord2vecModelFx.doneData,
    target: $testWord2vecModel,
});