import { Emotion } from "../emotion/type";

export type TPost = {
    text: string;
    id: number;
    authorName: string;
    authorId: number;
    authorLogin: string;
    likes?: number;
    isLiked: boolean;
    emotion: Emotion;
    date: string;
}

export type AddPostBody = {
    text: string;
}
