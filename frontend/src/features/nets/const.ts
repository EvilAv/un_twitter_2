import { API_PATH } from "../request/const";
import { ModelTypes } from "./types";

const NETS_API_PATH = `${API_PATH}/nets`;

export const getLocalStoragePath = (type: ModelTypes) =>
    `localstorage://${type}-model`;

export const BINARY_API_PATH = `${NETS_API_PATH}/binary-model`;
export const JSON_API_PATH = `${NETS_API_PATH}/json-model`;
