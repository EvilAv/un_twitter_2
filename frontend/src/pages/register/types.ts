export type RegisterForm = {
    login: string,
    nickname: string,
    password1: string,
    password2: string,
}

export type RegisterResponse = { 
    status: string,
    token?: string,
}
