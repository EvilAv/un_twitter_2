import React, { useCallback } from "react";
import { TPost } from "../../features/posts/types";
import UserIcon from "../../icons/user.svg";
import DeleteIcon from "../../icons/delete.svg";
import LikeIcon from "../../icons/like.svg";
import LikePressedIcon from "../../icons/like-pressed.svg";
import EmoIcon from "../../icons/no-mouth.svg";

import styles from "./styles.module.css";
import { useNavigate } from "react-router";
import { useUnit } from "effector-react";
import { $user } from "../../features/user/state";
import {
    postDeleted,
    postLiked,
    postUnliked,
} from "../../features/posts/state";
import { getEmotionIcon, getEmotionText } from "../../features/emotion";

const USER_ICON_SIZE = 30;
const DELETE_ICON_SIZE = 25;
const LIKE_ICON_SIZE = 25;
const EMO_ICON_SIZE = 22;

type Props = TPost & {
    ref?: (node?: Element | null) => void;
    canBeDeleted?: boolean;
}

export const PostItem = ({
    authorName,
    text,
    id,
    authorLogin,
    authorId,
    likes = 0,
    isLiked,
    emotion,
    canBeDeleted,
    date,
    ref
}: Props) => {
    const navigate = useNavigate();

    const handleUserClick = useCallback(() => {
        navigate(`/user/${authorId}`);
    }, [authorId]);

    const user = useUnit($user);
    const _likePost = useUnit(postLiked);
    const _unlikePost = useUnit(postUnliked);
    const _deletePost = useUnit(postDeleted);

    const deletePost = useCallback(() => {
        _deletePost(id);
    }, [id, authorId, user]);

    const likePost = useCallback(() => {
        _likePost(id);
    }, [id, authorId, user]);

    const unlikePost = useCallback(() => {
        _unlikePost(id);
    }, [id, authorId, user]);

    return (
        <div className={styles.root} ref={ref}>
            <div className={styles.header}>
                <div className={styles.user}>
                    <img
                        src={UserIcon}
                        width={USER_ICON_SIZE}
                        height={USER_ICON_SIZE}
                        className={styles.avatar}
                        onClick={handleUserClick}
                    />
                    <div>
                        <div>{authorName}</div>
                        <div className={styles.link} onClick={handleUserClick}>
                            @{authorLogin}
                        </div>
                    </div>
                </div>
                {user?.id === authorId && canBeDeleted && (
                    <img
                        src={DeleteIcon}
                        width={DELETE_ICON_SIZE}
                        height={DELETE_ICON_SIZE}
                        className={styles.delete}
                        onClick={deletePost}
                    />
                )}
            </div>
            <hr />
            <div className={styles.text}>{text}</div>
            <div className={styles.date}>{date}</div>
            <div className={styles["btn-group"]}>
                <div className={styles["like-section"]}>
                    {isLiked ? (
                        <img
                            src={LikePressedIcon}
                            width={LIKE_ICON_SIZE}
                            height={LIKE_ICON_SIZE}
                            className={styles["like-btn"]}
                            onClick={unlikePost}
                        />
                    ) : (
                        <img
                            src={LikeIcon}
                            width={LIKE_ICON_SIZE}
                            height={LIKE_ICON_SIZE}
                            className={styles["like-btn"]}
                            onClick={likePost}
                        />
                    )}
                    {likes > 0 && <div>{likes}</div>}
                </div>
                <div className={styles.emotion}>
                    <img
                        src={EmoIcon}
                        width={EMO_ICON_SIZE}
                        height={EMO_ICON_SIZE}
                    />
                    <div
                        title={getEmotionText(emotion)}
                        className={styles["emotion-icon"]}
                    >
                        {getEmotionIcon(emotion)}
                    </div>
                </div>
            </div>
        </div>
    );
};
