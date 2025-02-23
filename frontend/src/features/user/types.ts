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

export type UserRegisterForm = {
    login: string;
    nickname: string;
    password1: string;
    password2: string;
}
