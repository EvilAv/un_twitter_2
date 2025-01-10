type ErrorResponseBody = {
    msg: string;
}

type TokenBody = {
    token?: string;
}

export type ResponseBody<T> = T & Partial<ErrorResponseBody> & TokenBody;
