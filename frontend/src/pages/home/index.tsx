import React, { useEffect } from "react";
import { PostList } from "../../components/post-list";
import { NewPostButton } from "../../components/new-post-button";

export const Home = () => {

    return (
        <>
            <PostList />
            <NewPostButton />
        </>
    );
};
