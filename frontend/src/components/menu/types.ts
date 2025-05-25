export type menuItemIds = "home" | "subscriptions" | "my-posts" | "chats" | null;

export type TMenuItem = {
    id: menuItemIds;
    route: string;
    name: string;
    iconSrc: string;
};
