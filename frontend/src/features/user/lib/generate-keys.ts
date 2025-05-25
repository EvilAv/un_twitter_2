import CryptoJS from "crypto-js";
import nacl from "tweetnacl";
import util from "tweetnacl-util";
import { DEFAULT_SALT } from "../const";
import { savePrivateKey } from "./save-private-key";

export const generateKeys = (password: string) => {
    const key = CryptoJS.PBKDF2(password, DEFAULT_SALT, {
        keySize: 128 / 32,
    }).toString();

    const { publicKey, secretKey } = nacl.box.keyPair.fromSecretKey(
        util.decodeUTF8(key)
    );
    savePrivateKey(util.encodeBase64(secretKey));
    return {
        publicKey: util.encodeBase64(publicKey),
        privateKey: util.encodeBase64(secretKey),
    };
};
