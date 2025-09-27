import * as secp from "@noble/secp256k1";

async function main() {
   const secretKey = secp.utils.randomSecretKey()
   const publicKey = secp.getPublicKey(secretKey);

   const input = new TextEncoder().encode("shrey vats 2025");

   const signature = await secp.signAsync(input, secretKey);

   const isValid = await secp.verifyAsync(signature, input, publicKey);
}

main()