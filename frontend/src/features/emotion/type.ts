export type RawEmotion = {
    emotion: EmotionName;
}

export type EmotionName = 'nope' | 'joy' | 'anger'
export type EmotionEmoji = '😐' | '😃' | '🤬';

export type TEmotion = {
    emotion: EmotionName;
    emoji: EmotionEmoji;
}
