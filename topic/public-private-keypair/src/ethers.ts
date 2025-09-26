import {ethers} from "ethers"

const wallet = ethers.Wallet.createRandom();

const publicKey = wallet.address;
const privateKey = wallet.privateKey;

const message = "shrey vats"

const signature = await wallet.signMessage(message);

const isValid = ethers.verifyMessage(message, signature)  