export type ErrorResponseBody = {
    msg: string;
}

export type ResponseBody<T> = T & Partial<ErrorResponseBody>
