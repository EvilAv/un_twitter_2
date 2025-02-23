import { ResponseBody, SuccessResponseBody } from "../types";

export const handleServerError = <T>(data: ResponseBody<T>) => {
    if (data["error-message"]) {
        throw Error(data['error-message'])
    }

    return data as SuccessResponseBody<T>;
}