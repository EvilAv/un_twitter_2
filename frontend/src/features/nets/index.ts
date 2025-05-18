import { BINARY_API_PATH, getLocalStoragePath, JSON_API_PATH } from "./const";
import { ModelTypes } from "./types";
import * as tf from "@tensorflow/tfjs";

export const getModel = async (type: ModelTypes) => {
    let model;
    try {
        model = await tf.loadLayersModel(getLocalStoragePath(type));
    } catch (e) {
        model = await tf.loadLayersModel(`${JSON_API_PATH}/${type}`, {
            weightPathPrefix: `${BINARY_API_PATH}/${type}/`,
        });
        await model.save(getLocalStoragePath(type));
    }
    return model;
};
