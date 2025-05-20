export type TPost = {
    text: string;
    id: number;
    authorName: string;
    authorId: number;
    authorLogin: string;
    likes?: number;
    isLiked: boolean;
}

export type AddPostBody = {
    text: string;
}
