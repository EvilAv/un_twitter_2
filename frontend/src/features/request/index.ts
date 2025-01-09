import { API_PATH } from "./const";

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

export async function loginToApi(login: string, password: string) {
    const response = await fetch(API_PATH + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
            login,
            password,
        }),
    });

    const result = await response.json();
    if (result.message === 'ok' && result.token){
        return true;
    }
    return false;
}
