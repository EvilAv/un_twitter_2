import { User } from "../../user/types";
import { Message, RawMessage, UserWithKey } from "../types";
import { decryptMessage } from "./decrypt-message";

export const decryptRawMessage = (
    user1: User,
    user2: UserWithKey,
    message: RawMessage
): Message => {
    let text;
    if (message.authorId === user1.id) {
        const temp = decryptMessage({
            text: message.mineText,
            nonce: message.nonce,
            private_key: user1.private_key,
            public_key: user1.public_key,
        });
        text = temp ?? "";
    } else {
        const temp = decryptMessage({
            text: message.text,
            nonce: message.nonce,
            private_key: user1.private_key,
            public_key: user2.public_key,
        });
        text = temp ?? "";
    }

    return {
        text,
        date: message.date,
        authorId: message.authorId,
    };
};
