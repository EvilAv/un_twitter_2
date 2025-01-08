import React, { useCallback, useState } from "react";
import { getDataFromApi } from "../features/request";

export const App = () => {
    const [message, setMessage] = useState(null);

    const onClick = useCallback(async () => {
        const data = await getDataFromApi();
        if (data){
            setMessage(data.msg);
        }
    }, []);

    return (
        <>
            <button onClick={onClick}>click me</button>
            {message && <div>{message}</div>}
        </>
    );
};
