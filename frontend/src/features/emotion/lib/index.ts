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
        case 'fear':
            return {
                emotion: name,
                emoji: '😱',
            };
        case 'love':
            return {
                emotion: name,
                emoji: '🥰',
            };
        case 'sadness':
            return {
                emotion: name,
                emoji: '😢',
            };
        case 'surprise':
            return {
                emotion: name,
                emoji: '😮',
            };
    }
};

export const getOneEmotion = async (postId: number) => {
    const params = new URLSearchParams({
        post: String(postId),
    }).toString();
    const emotion = await getDataFromApi<RawEmotion>("/emotion/one", params);
    if (emotion) {
        return getFullEmotion(emotion.emotion);
    }
    return null;
};
