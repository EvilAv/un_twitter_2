import nacl from "tweetnacl";
import util from "tweetnacl-util";

type Params = {
    text: string;
    private_key: string;
    public_key: string;
    mine_public_key: string;
};

export const encryptMessage = ({text, private_key, public_key, mine_public_key}: Params) => {
    const nonce = nacl.randomBytes(nacl.box.nonceLength);


    const msg = nacl.box(
        util.decodeUTF8(text),
        nonce,
        util.decodeBase64(public_key),
        util.decodeBase64(private_key)
    );

    const mineMsg = nacl.box(
        util.decodeUTF8(text),
        nonce,
        util.decodeBase64(mine_public_key),
        util.decodeBase64(private_key)
    );

    return {
        text: util.encodeBase64(msg),
        mineText: util.encodeBase64(mineMsg),
        nonce: util.encodeBase64(nonce)
    }
};
