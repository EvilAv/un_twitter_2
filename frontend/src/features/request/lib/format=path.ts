export const formatPath = (path?: string) => {
    if (!path){
        return '';
    }
    if (path[path.length - 1] === '/'){
        return path.slice(0, path.length - 1);
    }
    return path
} 