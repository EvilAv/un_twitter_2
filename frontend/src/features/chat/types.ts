import { Emotion } from "../emotion/type";

export type Dialog = {
    id: number,
    userId: number,
    userLogin: string,
    userNickname: string,
}

export type DialoguesResponse = {
    dialogues: Dialog[]
}

export type UserWithKey = {
    nickname: string,
    id: number,
    login: string,
    public_key: string,
}

export type Message = {
    text: string;
    authorId: number;
    date: string;
    emotion: Emotion;
}

export type RawMessage = Message & {
    nonce: string;
    mineText: string;
}

export type MessageToSend = Omit<RawMessage, 'date'>