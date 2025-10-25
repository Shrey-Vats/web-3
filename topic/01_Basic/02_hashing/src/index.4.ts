/*
Assignment #3
What if I ask you to find a nonce for the following input - 
harkirat => Raman | Rs 100
Ram => Ankit | Rs 10
*/
import * as crypto from "node:crypto"

function findValueWithPrefix(prefix: string){
    let nonce = 0;
    const startwith = "000";
    let inputStr = prefix + nonce.toString();
    while(true){
        const hash = crypto.createHash("sha256").update(inputStr).digest("hex");

        if (hash.startsWith(startwith)){
            return {hashValue: hash, string: inputStr}
        }

        nonce++
    }
}
let prefix = `harkirat => Raman | Rs 100
Ram => Ankit | Rs 10`

const result = findValueWithPrefix(prefix);
console.log(result);