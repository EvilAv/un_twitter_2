import nacl from "tweetnacl";
import util from "tweetnacl-util";

type Params = {
    text: string;
    private_key: string;
    public_key: string;
};

export const encryptMessage = ({text, private_key, public_key}: Params) => {
    const nonce = nacl.randomBytes(nacl.box.nonceLength);


    const msg = nacl.box(
        util.decodeUTF8(text),
        nonce,
        util.decodeBase64(public_key),
        util.decodeBase64(private_key)
    );

    return {
        text: util.encodeBase64(msg),
        nonce: util.encodeBase64(nonce)
    }
};
