/*
Assignment #1
What if I ask you the following question — Give me an input string that outputs a SHA-256 hash that starts with 00000 . How will you do it?
A: You will have to brute force until you find a value that starts with 00000
 */

import * as crypto from "node:crypto";

let input = "0";
let startwith = "00000"
for (let i = 0; i < 999999; i++){
    const hash = crypto.createHash("sha256").update(input).digest("hex")

    if (hash.startsWith(startwith)){
        break
    }
    console.log(input)
    input = (Number(input) + 1).toString();
};

console.log("result is:- " + input);