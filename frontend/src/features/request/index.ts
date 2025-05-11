import { DEFAULT_ABORTION_MESSAGE } from "./const";
import { getApiRequest } from "./lib/get-api-request";
import { handleServerError } from "./lib/handle-server-error";
import { postApiRequest } from "./lib/post-api-request";
import { setAuthToken } from "./lib/set-auth-token";
import { withJWT } from "./lib/with-jwt";
import { PureResponseBody, RequestMethod, ResponseBody, UrlParams } from "./types";

// maybe need to refactor
export const getDataFromApi = async <T>(signal: AbortSignal, path?: string, params?: UrlParams) => {
    const stringParams = getUrlParams(params);
    console.log(7, signal)
    const data = await getApiRequest<T>(signal, path, stringParams);

    const successData = handleServerError(data);
    return successData;
};

export const getDataFromApiWithJWT = async <T>(signal: AbortSignal, path?: string, params?: UrlParams) => {
    const stringParams = getUrlParams(params);
    const data = await withJWT(getApiRequest)<T>(signal, path, stringParams);

    const successData = handleServerError(data);
    if (successData.token){
        setAuthToken(successData.token)
    }

    return successData as PureResponseBody<T>;
};

export const postDataToApi = async <R, B>(signal: AbortSignal, path?: string, params?: UrlParams, body?: B) => {
    const stringParams = getUrlParams(params);
    const data = await postApiRequest<R, B>(signal, path, stringParams, {body});

    const successData = handleServerError(data);
    return successData as PureResponseBody<R>;
}

export const postDataToApiWithJWT = async <R, B>(signal: AbortSignal, path?: string, params?: UrlParams, body?: B) => {
    const stringParams = getUrlParams(params);
    const data = await withJWT(postApiRequest)<R, B>(signal, path, stringParams, {body});

    const successData = handleServerError(data);
    if (successData.token){
        setAuthToken(successData.token)
    }

    return successData as PureResponseBody<R>;
}

const getUrlParams = (params?: UrlParams) => {
    if (!params){
        return '';
    }
    const pureClone: Record<string, string> = {};
    for (let [key, value] of Object.entries(params)){
        if (value !== undefined){
            pureClone[key] = String(value);
        }
    }
    const res = new URLSearchParams(pureClone);
    return res.toString();
}

export const requestFactory = <R, B = {}>(method: RequestMethod, path?: string,  withJWT: boolean = false) => {
    let controller = new AbortController();
    const getRequest = () => {
        let request;
        switch (method){
            case 'get': {
                if (withJWT){
                    request = (params?: UrlParams) => getDataFromApiWithJWT<R>(controller.signal, path, params);
                } else {
                    request = (params?: UrlParams) =>  getDataFromApi<R>(controller.signal, path, params);
                };
                break;
            }
            case "post": {
                if (withJWT){
                    request = (params?: UrlParams, body?: B) => postDataToApiWithJWT<R, B>(controller.signal, path, params, body);
                } else {
                    request = (params?: UrlParams, body?: B) => postDataToApi<R, B>(controller.signal, path, params, body);
                };
                break;
            }
        }
        return request;
    }
    return {
        log: () => console.log('it works'),
        getRequest,
        abort: () => {
            controller.abort(DEFAULT_ABORTION_MESSAGE);
            controller = new AbortController;
        },
    }
}