import { API_PATH } from "./const";
import { ResponseBody } from "./types";

export const getDataFromApi = async <T>(path?: string) => {
    try {
        const response = await fetch(API_PATH + (path ?? ""));

        const result = (await response.json()) as ResponseBody<T>;
        if (result.msg){
            return null;
        }
        // TODO: rewrite default error message filed from flask
        return result as Omit<T, 'msg'>;
    } catch (error) {
        console.log(error);
    }
    return null;
};

export const postRequestToApi = async <Params, Response>(
    path: string,
    params: Params
) => {
    try {
        const response = await fetch(API_PATH + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(params),
        });

        const result = (await response.json()) as ResponseBody<Response>;
        if (!result.msg) {
            return result as Omit<Response, "msg">;
        }
        console.log('backend error', result.msg);
    } catch (error) {
        console.log(error);
    }
    return null;
};

export const getDataFromApiWithJWT = async <T>(path?: string) => {
    try {
        const token = localStorage.getItem("auth_token");
        if (!token){
            return null;
        }

        const response = await fetch(API_PATH + (path ?? ""), {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result = (await response.json()) as ResponseBody<T>;
        if (result.msg){
            return null;
        }
        if (result.token){
            localStorage.setItem('auth_token', result.token);
        }
        return result as Omit<T, 'msg' | 'token'>;
    } catch (error) {
        console.log(error);
    }
    return null;
};
