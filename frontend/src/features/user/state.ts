import { createEffect, createEvent, createStore, sample } from "effector";
import {
    BackendUser,
    User,
    UserLoginForm,
    UserLoginResponse,
    UserRegisterForm,
    UserRegisterRequest,
} from "./types";
import { requestFactory } from "../request";
import { $errors } from "../errors/state";
import { showToast } from "../toasts";
import { removeAuthToken } from "../request/lib/remove-auth-token";
import { setAuthToken } from "../request/lib/set-auth-token";
import { DEFAULT_ABORTION_MESSAGE } from "../request/const";
import { generateKeys } from "./lib/generate-keys";
import { loadPrivateKey } from "./lib/load-private-key";
import { removePrivateKey } from "./lib/remove-private-key";

export const $user = createStore<User | null>(null);
export const $isAuthenticated = $user.map((user) => Boolean(user));

export const userCleared = createEvent();
export const userLoginFormFilled = createEvent<UserLoginForm>();
export const userRegisterFormFilled = createEvent<UserRegisterForm>();
export const getUserFxAborted = createEvent();

const getUser = requestFactory<BackendUser>("get", "/profile", true);
const postLoginUser = requestFactory<UserLoginResponse, UserLoginForm>(
    "post",
    "/login"
);
const postRegisterUser = requestFactory<UserLoginResponse, UserRegisterRequest>(
    "post",
    "/register"
);

export const getUserDataFx = createEffect(async () => {
    const request = getUser.getRequest();
    // need to fix later
    const data = await request({});
    return data;
});

export const loginUserToApiFx = createEffect(async (body: UserLoginForm) => {
    const request = postLoginUser.getRequest();
    const user = await request({ body });
    const { privateKey } = generateKeys(body.password);
    setAuthToken(user.token);
    // let key128Bits = CryptoJS.PBKDF2("Secret Passphrase", "0", {
    //     keySize: 128 / 32,
    // }).toString();
    // console.log(key128Bits);
    // const b = util.decodeUTF8(key128Bits);
    // // const enc = new TextEncoder()
    // // const a = enc.encode('456')
    // const { publicKey, secretKey } = nacl.box.keyPair.fromSecretKey(b);
    // const newUser = nacl.box.keyPair();
    // const nonce = nacl.randomBytes(nacl.box.nonceLength);
    // console.log(util.encodeBase64(publicKey));
    // const msg1 = nacl.box(
    //     util.decodeUTF8("hello there :3"),
    //     nonce,
    //     newUser.publicKey,
    //     secretKey
    // );

    // const decryptedMessage = nacl.box.open(
    //     msg1,
    //     nonce,
    //     publicKey,
    //     newUser.secretKey
    // );
    // console.log(util.encodeUTF8(decryptedMessage!));
    return { ...user, private_key: privateKey } as User;
});

export const registerUserToApiFx = createEffect(
    async (body: UserRegisterForm) => {
        const { publicKey, privateKey } = generateKeys(body.password1);
        const request = postRegisterUser.getRequest();
        const user = await request({
            body: {
                ...body,
                public_key: publicKey,
            },
        });
        setAuthToken(user.token);
        return { ...user, private_key: privateKey } as User;
    }
);

export const clearUserFx = createEffect(() => {
    removeAuthToken();
    removePrivateKey();
});

sample({
    clock: userLoginFormFilled,
    target: loginUserToApiFx,
});

sample({
    source: loginUserToApiFx.doneData,
    target: $user,
});

sample({
    clock: userRegisterFormFilled,
    target: registerUserToApiFx,
});

sample({
    source: registerUserToApiFx.doneData,
    target: $user,
});

$user
    .on(getUserDataFx.doneData, (_, user) => ({
        ...user,
        private_key: loadPrivateKey(),
    }))
    .on(userCleared, () => null);

sample({
    clock: userCleared,
    target: clearUserFx,
});

$user.watch(console.log);

sample({
    clock: getUserDataFx.failData,
    fn: (error) => error.message,
    filter: (error) => Boolean(error.message),
    target: $errors,
});

sample({
    clock: getUserDataFx.failData,
    filter: (error) => Boolean(error.message),
    target: userCleared,
});

sample({
    clock: loginUserToApiFx.failData,
    filter: (error) => Boolean(error.message),
    fn: (error) => error.message,
    target: $errors,
});

sample({
    clock: registerUserToApiFx.failData,
    filter: (error) => error.message === DEFAULT_ABORTION_MESSAGE,
    fn: (error) => error.message,
    target: $errors,
});

sample({
    clock: loginUserToApiFx.done,
    fn: () => showToast("success", "you successfully logged in"),
});

sample({
    clock: registerUserToApiFx.done,
    fn: () => showToast("success", "you successfully logged in"),
});

sample({
    clock: getUserFxAborted,
    fn: getUser.abort,
});
