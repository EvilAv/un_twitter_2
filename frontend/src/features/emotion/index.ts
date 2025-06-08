import { emotionIconList, emotionTextList } from "./const";
import { Emotion } from "./type";

export const getEmotionText = (emotion: Emotion) => emotionTextList[emotion];
export const getEmotionIcon = (emotion: Emotion) => emotionIconList[emotion];

export const getEmotionFromPredict = (predict: number[]) => {
    let max = 0;
    let maxIdx = 0;
    for (let i = 0; i < predict.length; i++) {
        if (predict[i] > max) {
            maxIdx = i;
            max = predict[i];
        }
    }
    return maxIdx;
};
