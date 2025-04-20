import { AUTH_TOKEN } from "../const";

export const removeAuthToken = () => {
    localStorage.removeItem(AUTH_TOKEN);
}