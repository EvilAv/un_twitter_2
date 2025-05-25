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