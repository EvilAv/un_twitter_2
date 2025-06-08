import nlp from "compromise";
import { EMPTY_TOKEN, STOP_WORDS, WORDS_CNT } from "../const";
import * as tf from "@tensorflow/tfjs";

const textPreprocess = (text: string) => {
    const doc = nlp(text);
    doc.normalize({
        plurals: false,
        verbs: false,
    });
    const arr: string[] = doc.json()[0].terms.map((term: any) => term.normal);
    const filtered = arr.filter((word) =>
        Boolean(!STOP_WORDS.has(word) && word.length > 1)
    );
    const prevLength = filtered.length;
    filtered.length = WORDS_CNT;
    return filtered.fill(EMPTY_TOKEN, prevLength);
};

export const wordToVector = (dict: any, text: string) => {
    const arr = textPreprocess(text);
    const rawNumbers = arr.map((word) => dict[word] ?? 0);
    const tensor = tf.tensor2d([rawNumbers]);
    return tensor;
};
