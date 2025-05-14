import { createEvent, createStore, sample } from "effector";
import { menuItemIds } from "./types";

export const $activeMenuItem = createStore<menuItemIds>("home");

export const activeItemChanged = createEvent<menuItemIds>();

$activeMenuItem.on(activeItemChanged, (_, newACtiveId) => newACtiveId);
