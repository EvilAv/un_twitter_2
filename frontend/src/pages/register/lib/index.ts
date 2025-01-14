import { postRequestToApi } from "../../../features/request"
import { RegisterForm, RegisterResponse } from "../types"

export const registerToApi = async (params: RegisterForm) => {
    const result = await postRequestToApi<RegisterForm, RegisterResponse>('/register', params);
    if (result && result.status === 'ok' && result.token){
        localStorage.setItem('auth_token', result.token);
    }
    // TODO: refactor it
    if (result){
        window.alert(result.status);
    }

    return result?.token || null;
}