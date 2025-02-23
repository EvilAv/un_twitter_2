import { API_PATH } from "./const";
import { getApiRequest } from "./lib/get-api-request";
import { handleServerError } from "./lib/handle-server-error";
import { postApiRequest } from "./lib/post-api-request";
import { setAuthToken } from "./lib/set-auth-token";
import { withJWT } from "./lib/with-jwt";
import { PureResponseBody, ResponseBody } from "./types";

export const getDataFromApi = async <T>(path?: string, params?: string) => {
    
    const data = await getApiRequest<T>(path, params);

    const successData = handleServerError(data);

    return successData;
};

export const getDataFromApiWithJWT = async <T>(path?: string, params?: string) => {

    const data = await withJWT(getApiRequest)<T>(path, params);

    const successData = handleServerError(data);
    if (successData.token){
        setAuthToken(successData.token)
    }

    return successData as PureResponseBody<T>;
};

export const postDataToApi = async <R, B>(path?: string, params?: string, body?: B) => {
    // not a best solution, need to refactor
    const data = await postApiRequest<R, B>(path, params, {}, body);

    const successData = handleServerError(data);

    return successData as PureResponseBody<R>;

}

// TODO: fix after returning my posts page
export const postRequestToApiWithJWT = async <Body, Response>(
    path: string,
    body: Body
) => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            return null;
        }

        const response = await fetch(API_PATH + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const result = (await response.json()) as ResponseBody<Response>;
        if (result.msg) {
            return null;
        }
        if (result.token) {
            localStorage.setItem("auth_token", result.token);
        }
        return result as Omit<Response, "msg" | "token">;
    } catch (error) {
        console.log(error);
    }
    return null;
};

