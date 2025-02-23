import { API_PATH } from "../const";
import { RequestSender, ResponseBody } from "../types";

export const getApiRequest: RequestSender = async <T>(
    path?: string,
    params?: string,
    headers?: HeadersInit,
) => {
    const response = await fetch(
        API_PATH + (path ?? "") + "?" + (params || ""),
        {
            headers,
        }
    );

    const result = await response.json();
    return result as ResponseBody<T>;
};
