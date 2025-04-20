import { AUTH_TOKEN } from "../const";

export const setAuthToken = (token: string) => {
    if (token.trim() !== '') {
        localStorage.setItem(AUTH_TOKEN, token);
    }
}