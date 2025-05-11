import { getDataFromApi } from "../../request";
import { EmotionEmoji, EmotionName, RawEmotion, TEmotion } from "../type";

const getFullEmotion = (name: EmotionName): TEmotion => {
    switch (name) {
        case "nope":
            return {
                emotion: name,
                emoji: "😐",
            };
        case "joy":
            return {
                emotion: name,
                emoji: "😃",
            };
        case "anger":
            return {
                emotion: name,
                emoji: "🤬",
            };
        case "fear":
            return {
                emotion: name,
                emoji: "😱",
            };
        case "love":
            return {
                emotion: name,
                emoji: "🥰",
            };
        case "sadness":
            return {
                emotion: name,
                emoji: "😢",
            };
        case "surprise":
            return {
                emotion: name,
                emoji: "😮",
            };
        case "disgust":
            return {
                emotion: name,
                emoji: "🤢",
            };
    }
};

export const getOneEmotion = async (postId: number) => {
    // TODO: fix this, but need store
    // const emotion = await getDataFromApi<RawEmotion>("/emotion/one", {
    //     post: postId
    // });
    // if (emotion) {
    //     return getFullEmotion(emotion.emotion);
    // }
    return null;
};
