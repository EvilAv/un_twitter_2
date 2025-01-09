import { postRequestToApi } from "../request";
import { LoginForm, LoginBody } from "./types";

export async function loginToApi(params: LoginForm) {
    const result = await postRequestToApi<LoginForm, LoginBody>('/login', params);
    if (result){
        localStorage.setItem('auth_token', result.token);
    }
    return result && result.token;
}