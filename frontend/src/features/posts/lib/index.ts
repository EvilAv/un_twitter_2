import { getDataFromApi } from "../../request"
import { TPost } from "../types"

export const getAllPosts = async (userId?: number) => {
    let params = ''
    if (userId !== undefined){
        params = new URLSearchParams({
            user: String(userId)
        }).toString()
    }
    const posts = await getDataFromApi<TPost[]>('/post/all', params);
    if (posts){
        return posts;
    }
    return [];
}