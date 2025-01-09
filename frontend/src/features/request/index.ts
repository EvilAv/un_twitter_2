import { API_PATH } from "./const";
import { ResponseBody } from "./types";

// TODO: add types
export async function getDataFromApi(path?: string) {
    try {
        const response = await fetch(API_PATH + (path ?? ""));
        if (response.ok) {
            const json = await response.json();
            return json;
        }
    } catch (error) {
        console.log(error);
    }
    return null;
}

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

        const json = (await response.json()) as T;
        return json;
    } catch (error) {
        console.log(error);
    }
    return null;
};
