import { postDataToApi } from "../../request";
import { setAuthToken } from "../../request/lib/set-auth-token";
import { UserLoginResponse, UserRegisterForm } from "../types";

export const registerUserToApi = async (registerForm: UserRegisterForm) => {
    const result = await postDataToApi<UserLoginResponse, UserRegisterForm>(
        "/register",
        "",
        registerForm
    );
    setAuthToken(result.token);
    return result;
};
