import React, { useEffect, useState } from "react";

import UserIcon from "./../../icons/user.svg";
import UsersIcon from "./../../icons/users.svg";
import HomeIcon from "../../icons/home.svg";
import BookIcon from "../../icons/book.svg";
import { MenuItem } from "../menu-item";

import styles from "./styles.module.css";
import { useLocation, useNavigate } from "react-router";
import { menuItemIds } from "./types";
import { useUnit } from "effector-react";
import { activeItemChanged } from "./state";
import { $isAuthenticated } from "../../features/user/state";

type menuPair = {
    id: menuItemIds;
    route: string;
};

const items: menuPair[] = [
    {
        id: "home",
        route: "/",
    },
    {
        id: "my-posts",
        route: "/my-posts",
    },
    {
        id: "subscriptions",
        route: "/subscriptions",
    },
];

const getActivePair = (url: string) =>
    items.find(({route}) => route === url);

export const Menu = () => {
    const { pathname } = useLocation();
    const isAuthenticated = useUnit($isAuthenticated);
    const updateActiveId = useUnit(activeItemChanged);
    const navigate = useNavigate();
    

    useEffect(() => {
        const activePair = getActivePair(pathname);
        updateActiveId(activePair?.id ?? null);
    }, [pathname]);

    useEffect(() => {
        if (!isAuthenticated && pathname !== '/login' && pathname !== '/register'){
            navigate('/login');
        }
        if (isAuthenticated && (pathname === '/login' || pathname === '/register')){
            navigate('/');
        }
    }, [pathname, isAuthenticated]);

    return (
        <div className={styles.root}>
            <MenuItem name="Home" id="home" svgSrc={HomeIcon} route="/" />
            <MenuItem
                name="Subscriptions"
                id="subscriptions"
                svgSrc={UsersIcon}
                route="/subscriptions"
            />
            <MenuItem
                name="My posts"
                id="my-posts"
                svgSrc={BookIcon}
                route="/my-posts"
            />
        </div>
    );
};
