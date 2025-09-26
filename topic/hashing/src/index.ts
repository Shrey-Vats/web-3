import * as crypto from "node:crypto";

interface findHashWithPrefixOutput {
  hashNumber: string;
  hashValue: string;
}

function findHashWithPrefix(prefix: string): findHashWithPrefixOutput {
  let statwith = "000";
  let nonce = 0;
  let inputStr = prefix + nonce.toString();

  while (true) {
    const hash = crypto.createHash("sha256").update(inputStr).digest("hex");

    if (hash.startsWith(statwith)) {
      return {
        hashNumber: inputStr,
        hashValue: hash,
      };
    }
    nonce++;
  }
}

const result = findHashWithPrefix("shrey");
console.log(`HashNumber: ${result.hashNumber}`);
console.log(`hashValue: ${result.hashValue}`);
