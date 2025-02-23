type ErrorResponseBody = {
    "error-message": string;
};

type TokenBody = {
    token: string;
};

export type PureResponseBody<T> = T;
export type SuccessResponseBody<T> = PureResponseBody<T> & Partial<TokenBody>;
export type ResponseBody<T> = SuccessResponseBody<T> & Partial<ErrorResponseBody>

export type RequestSender = <R, B = {}>(
    path?: string,
    params?: string,
    headers?: HeadersInit,
    body?: B,
) => Promise<ResponseBody<R>>;
