import React from "react";

import { useNavigate } from "react-router";

const ICON_SIZE = 30;

import styles from "./styles.module.css";
import { useUnit } from "effector-react";
import { $activeMenuItem, activeItemChanged } from "../menu/state";
import { menuItemIds } from "../menu/types";

type Props = {
    route: string;
    svgSrc: string;
    name: string;
    id: menuItemIds;
};

export const MenuItem = ({ route, svgSrc, name, id }: Props) => {
    const navigate = useNavigate();
    const activeId = useUnit($activeMenuItem);

    const updateActiveId = useUnit(activeItemChanged);
    const isActive = activeId && activeId === id;
    return (
        <div
            onClick={() => {
                navigate(route);
                updateActiveId(id);
            }}
            className={`${styles.item} ${isActive && styles.item_active}`}
        >
            <img src={svgSrc} className={styles.icon} />
            <span className={styles.text}>{name}</span>
        </div>
    );
};
