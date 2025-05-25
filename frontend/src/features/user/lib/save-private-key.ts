import { PRIVATE_KEY } from "../const";

export const savePrivateKey = (privateKey: string) => {
    localStorage.setItem(PRIVATE_KEY, privateKey);
}