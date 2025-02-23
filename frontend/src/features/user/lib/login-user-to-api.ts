import { postDataToApi } from "../../request";
import { setAuthToken } from "../../request/lib/set-auth-token";
import { UserLoginForm, UserLoginResponse } from "../types";

export async function loginUserToApi(loginForm: UserLoginForm) {
    const result = await postDataToApi<UserLoginResponse, UserLoginForm>(
        "/login",
        "",
        loginForm
    );
    setAuthToken(result.token);
    return result;
}
