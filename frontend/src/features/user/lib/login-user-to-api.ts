import { postRequestToApi } from "../../request";
import { UserLoginForm, UserLoginResponse } from "../types";

export async function loginUserToApi(params: UserLoginForm) {
    const result = await postRequestToApi<UserLoginForm, UserLoginResponse>('/login', params);
    if (result){
        localStorage.setItem('auth_token', result.token);
    }
    return result && result.token;
}
