import { postDataToApiWithJWT } from "../../request";
import { AddPostBody, TPost } from "../types";

export async function addNewPost(text: string) {
    const result = await postDataToApiWithJWT<TPost, AddPostBody>(
        "/post/create",
        "",
        {text}
    );
    return result;
}
