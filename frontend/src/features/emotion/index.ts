import { emotionIconList, emotionTextList } from "./const";
import { Emotion } from "./type";

export const getEmotionText = (emotion: Emotion) => emotionTextList[emotion];
export const getEmotionIcon = (emotion: Emotion) => emotionIconList[emotion];
