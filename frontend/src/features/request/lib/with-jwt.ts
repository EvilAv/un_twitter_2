import { UnauthorizedError } from "../../errors/types";
import { RequestSender } from "../types";

export const withJWT = (sender: RequestSender) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        throw Error(UnauthorizedError);
    }

    const handlerWithJWT: RequestSender = (signal, path, params, options) =>
        sender(signal, path, params, {
            headers: { ...options?.headers, Authorization: `Bearer ${token}` },
            body: options?.body,
        });

    return handlerWithJWT;
};
