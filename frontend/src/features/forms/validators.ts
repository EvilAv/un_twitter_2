export const emptyStringValidator = (data: string) => {
    if (data.trim() === ''){
        return "Empty field";
    }
}