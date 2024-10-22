async function Generatekey() {
    try {
        const algo = process.env.NEXT_PUBLIC_CRYPTO_ALGORITHM ;
        const hash = process.env.NEXT_PUBLIC_CRYPTO_HASH;
        if(!algo || !hash){
            throw Error("error while encryption");
        }
        let keyPair = await window.crypto.subtle.generateKey(
            {
                name: algo,
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: hash,
            },
            true,
            ["encrypt", "decrypt"],
        );
        return keyPair;
    } catch (error) {
        throw Error("error while encryption");
    }
}

async function encrypt(message:string, publickey:CryptoKey) {
    try {
        const algo = process.env.NEXT_PUBLIC_CRYPTO_ALGORITHM ;
        if(!algo){
            throw Error("error while encryption");
        }
        const data = new TextEncoder().encode(message);
        const encrypteddata = await window.crypto.subtle.encrypt({
            name:algo
        },
        publickey,
        data
        )
        return encrypteddata;
    } catch (error) {
        console.log(error)
        throw Error("error while encryption");
    }
}

async function decrypt(message:BufferSource, privatekey:CryptoKey) {
    try {
        const algo = process.env.NEXT_PUBLIC_CRYPTO_ALGORITHM ;
        if(!algo){
            throw Error("error while encryption");
        }
        const decrypteddata = await window.crypto.subtle.decrypt({
            name:algo
        },
        privatekey,
        message
        )
        const decodedata = await new TextDecoder().decode(decrypteddata)
        return decodedata;
    } catch (error) {
        throw Error("error while encryption");
    }
}

export {
    Generatekey,
    encrypt,
    decrypt
}