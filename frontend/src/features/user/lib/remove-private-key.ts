import { PRIVATE_KEY } from "../const";

export const removePrivateKey = () => {
    localStorage.removeItem(PRIVATE_KEY);
}