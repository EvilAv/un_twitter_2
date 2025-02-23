import { API_PATH } from "../const";
import { RequestSender, ResponseBody } from "../types";

export const postApiRequest: RequestSender = async<R, B> (
    path?: string,
    params?: string,
    headers?: HeadersInit,
    body?: B,
) => {
    const response = await fetch(
        API_PATH + (path ?? "") + "?" + (params || ""),
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                ...headers,
            },
            body: JSON.stringify(body),
        }
    );

    const result = await response.json();
    return result as ResponseBody<R>;
};
