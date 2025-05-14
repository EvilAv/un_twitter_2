import { API_PATH } from "../const";
import { RequestSender, ResponseBody } from "../types";
import { formatPath } from "./format=path";

export const getApiRequest: RequestSender = async <T>(
    signal: AbortSignal,
    path?: string,
    params?: string,
    options?: {
        headers?: HeadersInit,
    }
) => {
    const response = await fetch(
        API_PATH + formatPath(path) + "?" + (params || ""),
        {
            headers: options?.headers,
            signal,
        }
    );

    const result = await response.json();
    return result as ResponseBody<T>;
};
