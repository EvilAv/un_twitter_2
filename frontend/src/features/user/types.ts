export type User = {
    nickname: string,
    id: number,
}

export type UserLoginResponse = User & {
    token: string;
}

export type UserLoginForm = {
    login: string;
    password: string;
}
