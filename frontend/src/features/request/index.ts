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
    const data = await postApiRequest<R, B>(path, params, {body});

    const successData = handleServerError(data);

    return successData as PureResponseBody<R>;

}

export const postDataToApiWithJWT = async <R, B>(path?: string, params?: string, body?: B) => {
    const data = await withJWT(postApiRequest)<R, B>(path, params, {body});

    const successData = handleServerError(data);

    return successData as PureResponseBody<R>;

}


