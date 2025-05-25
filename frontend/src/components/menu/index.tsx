import React, { useEffect, useState } from "react";

import UsersIcon from "./../../icons/users.svg";
import HomeIcon from "../../icons/home.svg";
import BookIcon from "../../icons/book.svg";
import ChatIcon from "../../icons/chat.svg";
import { MenuItem } from "../menu-item";

import styles from "./styles.module.css";
import { useLocation, useNavigate } from "react-router";
import { TMenuItem } from "./types";
import { useUnit } from "effector-react";
import { activeItemChanged } from "./state";
import { $isAuthenticated } from "../../features/user/state";

const items: TMenuItem[] = [
    {
        id: "home",
        route: "/",
        name: "Home",
        iconSrc: HomeIcon,
    },
    {
        id: "my-posts",
        route: "/my-posts",
        name: "My posts",
        iconSrc: UsersIcon,
    },
    {
        id: "subscriptions",
        route: "/subscriptions",
        name: "Subscriptions",
        iconSrc: BookIcon,
    },
    {
        id: "chats",
        route: "/chats",
        name: "Chats",
        iconSrc: ChatIcon,
    },
];

const getActivePair = (url: string) => items.find(({ route }) => route === url);

export const Menu = () => {
    const { pathname } = useLocation();
    const updateActiveId = useUnit(activeItemChanged);
    const navigate = useNavigate();

    useEffect(() => {
        const activePair = getActivePair(pathname);
        updateActiveId(activePair?.id ?? null);
    }, [pathname]);

    return (
        <div className={styles.root}>
            {items.map((item, idx) => (
                <MenuItem
                    key={idx}
                    name={item.name}
                    id={item.id}
                    svgSrc={item.iconSrc}
                    route={item.route}
                />
            ))}
        </div>
    );
};
