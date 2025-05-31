import { showToast } from "../../features/toasts";

export const handleError = (msg: string) => {
    showToast("error", msg);
};
