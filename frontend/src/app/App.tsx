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
import { Chats } from "../pages/chats";
import { Chat } from "../pages/chat";
import { NewPostModal } from "../components/new-post-modal";

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
                                    <Route path="*" element={<Login />} />
                                </>
                            ) : (
                                <>
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
                                    <Route path="/chats" element={<Chats />} />
                                    <Route
                                        path="/chat/:id"
                                        element={<Chat />}
                                    />
                                    <Route path="*" element={<Home />} />
                                </>
                            )}
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
            <NewPostModal />
        </>
    );
};
