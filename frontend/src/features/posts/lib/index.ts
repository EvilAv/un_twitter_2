import { getDataFromApi } from "../../request"
import { TPost } from "../types"

export const getAllPosts = async () => {
    const posts = await getDataFromApi<TPost[]>('/post/all');
    if (posts){
        return posts;
    }
    return [];
}