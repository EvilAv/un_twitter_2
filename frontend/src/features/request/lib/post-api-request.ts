import { API_PATH } from "../const";
import { RequestSender, ResponseBody } from "../types";

export const postApiRequest: RequestSender = async<R, B> (
    signal: AbortSignal,
    path?: string,
    params?: string,
    options?: {
        headers?: HeadersInit,
        body?: B,
    }
) => {
    const response = await fetch(
        API_PATH + (path ?? "") + "?" + (params || ""),
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                ...options?.headers,
            },
            body: JSON.stringify(options?.body),
            signal
        }
    );

    const result = await response.json();
    return result as ResponseBody<R>;
};
