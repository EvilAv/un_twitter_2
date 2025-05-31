import { io } from "socket.io-client";
import { API_PATH } from "../request/const";
import { UnauthorizedError } from "../errors/types";

export const getSocket = () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        throw Error(UnauthorizedError);
    }
    return io(API_PATH, {
        autoConnect: false,
        extraHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });
};
