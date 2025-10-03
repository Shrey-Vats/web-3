import  type { Request, Response } from "express"
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key"
import nacl from "tweetnacl";

export const seedGenrator =  (req: Request, res: Response) => {
    try {
        
    const mnemonic = generateMnemonic();
    // console.log(mnemonic)
    const seed = mnemonicToSeedSync(mnemonic);
    // console.log(seed)
    const path = `m/44'/501'/0'/0'` // this is derivation  path
    const {key} = derivePath(path, seed.toString("hex"));

    const secret = nacl.sign.keyPair.fromSeed(key).secretKey
    console.log(key);
    console.log(":secret: " + secret)
    res.status(200).json({
        code : key,
        secret: 
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "something happen wrong"
        });
    };
};