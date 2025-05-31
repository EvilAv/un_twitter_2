import nacl from "tweetnacl";
import util from "tweetnacl-util";

type Params = {
    text: string;
    private_key: string;
    public_key: string;
    nonce: string;
};

export const decryptMessage = ({text, private_key, public_key, nonce}: Params) => {

    const msg = nacl.box.open(
        util.decodeBase64(text),
        util.decodeBase64(nonce),
        util.decodeBase64(public_key),
        util.decodeBase64(private_key)
    );

    if (!msg){
        return null;
    }
    return util.encodeUTF8(msg)
};
