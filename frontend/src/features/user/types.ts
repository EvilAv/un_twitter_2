export type BackendUser = {
    nickname: string,
    id: number,
    public_key: string,
}

export type User = BackendUser & {
    private_key: string
}

export type UserLoginResponse = BackendUser & {
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

export type UserRegisterRequest = UserRegisterForm & {
    public_key: string;
}
