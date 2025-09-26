import * as crypto from "node:crypto";

const input = "shrey vats";
const hash = crypto.createHash("sha256").update(input).digest("hex");

console.log(hash);
