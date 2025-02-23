export const setAuthToken = <T>(token: string) => {
    if (token.trim() !== '') {
        localStorage.setItem("auth_token", token);
    }
}