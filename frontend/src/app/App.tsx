import React, { useCallback, useEffect, useState } from "react";
import { Header } from "../components/header";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "../pages/home";
import { Login } from "../pages/login";
import { Register } from "../pages/register";
import { getDataFromApiWithJWT } from "../features/request";
import { MyPosts } from "../pages/my-posts/inex";

type Data = {
    nickname: string;
    id: number;
};

export const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        async function getData() {
            const data = await getDataFromApiWithJWT<Data>("/profile");
            if (data) {
                setData(data);
                setIsAuthenticated(true);
            }
        }
        getData();
    }, [isAuthenticated]);

    return (
        <>
            <BrowserRouter>
                <Header
                    isAuthenticated={isAuthenticated}
                    onLogout={() => setIsAuthenticated(false)}
                    nickname={data?.nickname || ""}
                />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/login"
                        element={
                            // maybe should refactor
                            <Login onLogin={() => setIsAuthenticated(true)} />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <Register
                                onLogin={() => setIsAuthenticated(true)}
                            />
                        }
                    />
                    {isAuthenticated && data && (
                        <Route
                            path="/my-posts"
                            element={<MyPosts userId={data.id} />}
                        />
                    )}
                </Routes>
            </BrowserRouter>
        </>
    );
};
