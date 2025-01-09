import React, { useCallback, useState } from "react";
import { getDataFromApi } from "../features/request";
import { Header } from "../components/header";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "../pages/home";
import { Login } from "../pages/login";

export const App = () => {
    const [message, setMessage] = useState(null);

    const onClick = useCallback(async () => {
        const data = await getDataFromApi();
        if (data) {
            setMessage(data.msg);
        }
    }, []);

    return (
        <>
            <BrowserRouter>
                <Header isAuthenticated={false} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};
