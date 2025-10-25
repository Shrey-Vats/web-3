import * as ed from "@noble/ed25519";

const main = async () => {
    const privateKey = ed.utils.randomSecretKey();

    const message = new TextEncoder().encode("hello world");

    const publicKey = await ed.getPublicKeyAsync(privateKey);

    const signature = await ed.signAsync(message, privateKey);

    const isValid = await ed.verifyAsync(signature, message, publicKey)

    function binaryToString(value: any){
        return Buffer.from(value).toString("base64");
    }

    console.log("Binary Data");
    console.log(`Private key ${privateKey}`);
    console.log(`public key ${publicKey}`);
    console.log(`message ${message}`);
    console.log(`signature ${signature}`);
    console.log(`isValid ${isValid}`);
    
    console.log("")
    console.log("")
    console.log("")

    console.log(`Private key ${binaryToString(privateKey)}`);
    console.log(`public key ${binaryToString(publicKey)}`);
    console.log(`message ${binaryToString(message)}`);
    console.log(`signature ${binaryToString(signature)}`);
}

// const main1 = async () => {
//     const privateKey = ed.utils.randomSecretKey();

//     const publicKey = await ed.getPublicKeyAsync(privateKey);

//     const message = new TextEncoder().encode("i am iron man");

//     const signature = await ed.signAsync(message, privateKey);

//     const isValid = ed.verifyAsync(signature, message, publicKey)
// }

main()