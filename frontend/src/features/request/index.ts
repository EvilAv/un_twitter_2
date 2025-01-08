import { API_PATH } from "./const";

// TODO: add types
export async function getDataFromApi(path?: string) {
    try {
        const response = await fetch(API_PATH + (path ?? ''));
        if (response.ok){
            const json = await response.json();
            return json;
        }
    } catch (error) {
        console.log(error)
    }
    return null;
}