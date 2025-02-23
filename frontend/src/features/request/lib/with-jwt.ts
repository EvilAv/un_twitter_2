import { UnauthorizedError } from "../../errors/types";
import { RequestSender } from "../types";

export const withJWT = (sender: RequestSender) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        throw Error(UnauthorizedError);
    }

    const handlerWithJWT: RequestSender = (path, params) =>
        sender(path, params, {
            Authorization: `Bearer ${token}`,
        });

    return handlerWithJWT;
};
