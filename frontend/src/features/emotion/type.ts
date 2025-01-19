export type RawEmotion = {
    emotion: EmotionName;
}

export type EmotionName = 'nope' | 'joy' | 'anger' | 'love' | 'fear' | 'sadness' | 'surprise'
export type EmotionEmoji = '😐' | '😃' | '🤬' | '🥰' | '😱' | '😢' | '😮';

export type TEmotion = {
    emotion: EmotionName;
    emoji: EmotionEmoji;
}
