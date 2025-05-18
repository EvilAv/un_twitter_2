export type TPost = {
    text: string;
    id: number;
    authorName: string;
    authorId: number;
    authorLogin: string;
}

export type AddPostBody = {
    text: string;
}
