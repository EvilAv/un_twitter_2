import React, { useEffect } from "react";
import { Header } from "../components/header";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "../pages/home";
import { Login } from "../pages/login";
import { Register } from "../pages/register";
import { MyPosts } from "../pages/my-posts/index";
import { useUnit } from "effector-react";
import { appStarted, startRequestsAborted } from "./state";
import { $isAuthenticated, $user } from "../features/user/state";
import { ToastContainer } from "react-toastify";
import { Menu } from "../components/menu";

import styles from "./styles.module.css";
import { Subscriptions } from "../pages/subscriptions";
import { UserPage } from "../pages/user-page";
import { NetTest } from "../pages/net-test";

export const App = () => {
    const appStart = useUnit(appStarted);
    const abortRequests = useUnit(startRequestsAborted);
    const userData = useUnit($user);
    const isAuthenticated = useUnit($isAuthenticated);

    console.log(isAuthenticated);

    useEffect(() => {
        appStart();
        return () => abortRequests();
    }, []);

    return (
        <>
            <ToastContainer />
            <BrowserRouter>
                <Header />
                <div className={styles.root}>
                    <div className={styles.content}>
                        <Menu />
                        <Routes>
                            {!isAuthenticated ? (
                                <>
                                    <Route path="/login" element={<Login />} />
                                    <Route
                                        path="/register"
                                        element={<Register />}
                                    />
                                    <Route
                                        path="/net-test"
                                        element={<NetTest />}
                                    />
                                </>
                            ) : (
                                <>
                                    <Route path="/" element={<Home />} />
                                    <Route
                                        path="/my-posts"
                                        element={<MyPosts />}
                                    />
                                    <Route
                                        path="/subscriptions"
                                        element={<Subscriptions />}
                                    />
                                    <Route
                                        path="/user/:id"
                                        element={<UserPage />}
                                    />
                                    <Route
                                        path="/net-test"
                                        element={<NetTest />}
                                    />
                                </>
                            )}
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        </>
    );
};
