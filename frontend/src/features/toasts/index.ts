import { Bounce, toast, ToastOptions } from "react-toastify";
import { ToastType } from "./types";

export const showToast = (type: ToastType, message: string) => {

    const options: ToastOptions = {
        position: 'top-right',
        autoClose: 5000,
        closeOnClick: true,
        theme: 'light',
        pauseOnHover: true,
        transition: Bounce,
    };

    switch (type) {
        case "error": {
            toast.error(message, {...options, autoClose: false});
            break;
        }
        case "success": {
            toast.success(message, options);
            break;
        }
    }
};
