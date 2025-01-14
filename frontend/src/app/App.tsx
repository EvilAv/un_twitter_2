import React, { useCallback, useEffect, useState } from "react";
import { Header } from "../components/header";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "../pages/home";
import { Login } from "../pages/login";
import { Register } from "../pages/register";

export const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <>
            <BrowserRouter>
                <Header
                    isAuthenticated={isAuthenticated}
                    onLogout={() => setIsAuthenticated(false)}
                    onLogin={() => setIsAuthenticated(true)}
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
                </Routes>
            </BrowserRouter>
        </>
    );
};
