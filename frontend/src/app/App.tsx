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

export const App = () => {
    const appStart = useUnit(appStarted);
    const abortRequests = useUnit(startRequestsAborted);
    const userData = useUnit($user);
    const isAuthenticated = useUnit($isAuthenticated);

    useEffect(() => {
        appStart();
        return () => abortRequests();
    }, []);

    return (
        <>
            <ToastContainer />
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {isAuthenticated && (
                        <Route path="/my-posts" element={<MyPosts />} />
                    )}
                </Routes>
            </BrowserRouter>
        </>
    );
};
