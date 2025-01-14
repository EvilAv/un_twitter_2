import React from "react";
import { useNavigate } from "react-router";

import style from './styles.module.css'

export const Logo = () => {
    const navigate = useNavigate();
    return <div className={style.logo} onClick={() => navigate("/")}>U_T</div>;
};
