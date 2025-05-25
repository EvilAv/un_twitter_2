import { PRIVATE_KEY } from "../const";

export const loadPrivateKey = () => {
    const key = localStorage.getItem(PRIVATE_KEY);
    return key ?? '';
}