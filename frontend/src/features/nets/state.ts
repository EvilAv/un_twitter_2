import { LayersModel } from "@tensorflow/tfjs";
import { createEffect, createEvent, createStore, sample } from "effector";
import { getModel } from ".";
import { requestFactory } from "../request";

export const $testModel = createStore<LayersModel | null>(null);
export const $testWord2vecModel = createStore<LayersModel | null>(null);
export const $finalModel = createStore<LayersModel | null>(null);
export const $jsonDict = createStore<any | null>(null);

export const testModelRequested = createEvent();
export const testWord2vecModelRequested = createEvent();

const getJsonDict = requestFactory<any>("get", "/nets/get-dict");

export const getTestModelFx = createEffect(async () => {
    const model = await getModel("test");
    return model;
});

export const getJsonDictFx = createEffect(async () => {
    const request = getJsonDict.getRequest();
    const data = await request({});
    return data;
});

sample({
    clock: getJsonDictFx.doneData,
    target: $jsonDict
})

export const getTestWord2vecModelFx = createEffect(async () => {
    const model = await getModel("test-word2vec");
    return model;
});

export const getFinalModel = createEffect(async () => {
    const model = await getModel("final");
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
    clock: getFinalModel.doneData,
    target: $finalModel,
});

sample({
    clock: testWord2vecModelRequested,
    target: getTestWord2vecModelFx,
});

sample({
    clock: getTestWord2vecModelFx.doneData,
    target: $testWord2vecModel,
});
