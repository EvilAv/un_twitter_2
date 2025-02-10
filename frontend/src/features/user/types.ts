export type User = {
    nickname: string,
    id: number,
}

export type UserLoginResponse = {
    token: string;
}

export type UserLoginForm = {
    login: string;
    password: string;
}
