import React from "react";
import { PostList } from "../../components/post-list";

import { useUnit } from "effector-react";
import { $user } from "../../features/user/state";
import { NewPostButton } from "../../components/new-post-button";

type NewPostFormData = {
    text: string;
};

export const MyPosts = () => {
    const user = useUnit($user);

    if (!user) {
        return null;
    }

    return (
        <>
            <PostList userId={user.id} canDelete/>
            <NewPostButton />
        </>
    );
};
