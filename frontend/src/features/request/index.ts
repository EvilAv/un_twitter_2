import { DEFAULT_ABORTION_MESSAGE } from "./const";
import { deleteApiRequest } from "./lib/delete-api-request";
import { getApiRequest } from "./lib/get-api-request";
import { handleServerError } from "./lib/handle-server-error";
import { postApiRequest } from "./lib/post-api-request";
import { setAuthToken } from "./lib/set-auth-token";
import { withJWT } from "./lib/with-jwt";
import { PureResponseBody, RequestMethod, RequestProps, ResponseBody, UrlParams } from "./types";

// maybe need to refactor
export const getDataFromApi = async <T>(signal: AbortSignal, path?: string, params?: UrlParams) => {
    const stringParams = getUrlParams(params);
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

export const deleteDataFromApi = async <T>(signal: AbortSignal, path?: string, params?: UrlParams) => {
    const stringParams = getUrlParams(params);
    const data = await deleteApiRequest<T>(signal, path, stringParams);

    const successData = handleServerError(data);
    return successData;
};

export const deleteDataFromApiWithJWT = async <T>(signal: AbortSignal, path?: string, params?: UrlParams) => {
    const stringParams = getUrlParams(params);
    const data = await withJWT(deleteApiRequest)<T>(signal, path, stringParams);

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
                    request = ({pathParams = '', queryParams}: RequestProps<B>) => getDataFromApiWithJWT<R>(controller.signal, `${path}/${pathParams}`, queryParams);
                } else {
                    request = ({pathParams = '', queryParams}: RequestProps<B>) =>  getDataFromApi<R>(controller.signal, `${path}/${pathParams}`, queryParams);
                };
                break;
            }
            case 'delete': {
                if (withJWT){
                    request = ({pathParams = '', queryParams}: RequestProps<B>) => deleteDataFromApiWithJWT<R>(controller.signal, `${path}/${pathParams}`, queryParams);
                } else {
                    request = ({pathParams = '', queryParams}: RequestProps<B>) =>  deleteDataFromApi<R>(controller.signal, `${path}/${pathParams}`, queryParams);
                };
                break;
            }
            case "post": {
                if (withJWT){
                    request = ({pathParams = '', queryParams, body}: RequestProps<B>) => postDataToApiWithJWT<R, B>(controller.signal, `${path}/${pathParams}`, queryParams, body);
                } else {
                    request = ({pathParams = '', queryParams, body}: RequestProps<B>) => postDataToApi<R, B>(controller.signal, `${path}/${pathParams}`, queryParams, body);
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