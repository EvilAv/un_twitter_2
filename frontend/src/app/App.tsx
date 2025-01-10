import React, { useCallback, useEffect, useState } from "react";
import { Header } from "../components/header";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "../pages/home";
import { Login } from "../pages/login";

export const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // kind of bad practice, cause we think we are logged in even token has expired
        // need to refactor then
        const token = localStorage.getItem("auth_token");
        if (token) {
            setIsAuthenticated(true);
        }
    }, [setIsAuthenticated]);

    return (
        <>
            <BrowserRouter>
                <Header
                    isAuthenticated={isAuthenticated}
                    onLogout={() => setIsAuthenticated(false)}
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
                </Routes>
            </BrowserRouter>
        </>
    );
};
