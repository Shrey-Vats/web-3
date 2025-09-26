import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

const keyPair = Keypair.generate();

const publicKey = keyPair.publicKey.toString();
const secretKey = keyPair.secretKey;

const message = new TextEncoder().encode("Hello world");

const signature = nacl.sign.detached(message, secretKey);
const verify = nacl.sign.detached.verify( message, signature, keyPair.publicKey.toBytes())



// console.log's
function bitsToString(value: any){
   return Buffer.from(value).toString("base64")
}
const verify1 = nacl.sign.detached.verify( new TextEncoder().encode("Hello world"), signature, keyPair.publicKey.toBytes());

console.log("public key is:- " + publicKey);
console.log("private key is:- " + secretKey, "private key value is :- " + bitsToString(secretKey));
console.log("signature:- "  + signature, "signature value is :- " + bitsToString(signature));
console.log("verify? :- " + verify)
console.log("verify? :- " + verify1)



// async function testing() {
//    const publicKey = keyPair.publicKey;
//    const privateKey = keyPair.secretKey;

//    const message = new TextEncoder().encode("i am indian");

//    const signature = nacl.sign.detached(message, privateKey);

// }