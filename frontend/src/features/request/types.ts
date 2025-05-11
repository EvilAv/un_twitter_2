type ErrorResponseBody = {
    "error-message": string;
};

type TokenBody = {
    token: string;
};

export type PureResponseBody<T> = T;
export type SuccessResponseBody<T> = PureResponseBody<T> & Partial<TokenBody>;
export type ResponseBody<T> = SuccessResponseBody<T> & Partial<ErrorResponseBody>

export type RequestOptions<T> = {
    headers?: HeadersInit,
    body?: T
}

export type RequestSender = <R, B = {}>(
    signal: AbortSignal,
    path?: string,
    params?: string,
    options?: RequestOptions<B>,
) => Promise<ResponseBody<R>>;

export type UrlParams = Record<string, any> | null;

export type RequestMethod = 'get' | 'post';