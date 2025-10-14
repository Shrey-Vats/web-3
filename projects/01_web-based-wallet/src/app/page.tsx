"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { Wallet, HDNodeWallet, ethers, formatEther } from "ethers";
import bs58 from "bs58";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

type wallet = "Solana" | "Ethereum";

interface AllWallet {
  id: string;
  publicKey: string;
  privateKey: string;
  type: wallet;
  balance?: string;
}

interface CurrentIndex {
  Solana: string;
  Ethereum: string;
}

export default function Home() {
  const [amount, setAmount] = useState<number | string>("ADD any wallet");
  const [WalletType, setWalletType] = useState<wallet>("Solana");
  const [allWallets, setAllWallets] = useState<AllWallet[]>([]);
  const [CurrenSolanatIndex, setCurrentSolanaIndex] = useState<number>(0);
  const [CurrenEthereumIndex, setCurrentEthereumIndex] = useState<number>(0);
  const [mnemonic, setMnemonic] = useState<string>("");
  const [currentAccount, setCurrentAccount] = useState<AllWallet>();
  const [senderPublicId, setSenderPublicId] = useState("");
  const [sendAmount, setSendAmount] = useState("0");

  const SolanaLogo =
    "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png";
  const EthereumLogo =
    "https://blog.logomyway.com/wp-content/uploads/2021/11/Ethereum-logo.png";

  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/-ZOXWGksXSCTgRC9qT3FY"
  );
  const EthereumProvider = new ethers.JsonRpcProvider(
    "https://eth-mainnet.g.alchemy.com/v2/-ZOXWGksXSCTgRC9qT3FY"
  );

  const addWallet = async () => {
    console.log("clicked");
    const seed = await mnemonicToSeed(mnemonic);
    let path;
    if (WalletType === "Solana") {
      setCurrentSolanaIndex((prev) => prev + 1);
      path = `m/44'/501'/${CurrenSolanatIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

      const keypair = Keypair.fromSecretKey(secret);

      setAllWallets((prev) => [
        ...prev,
        {
          id: `solana ${CurrenSolanatIndex}`,
          privateKey: bs58.encode(keypair.secretKey),
          publicKey: keypair.publicKey.toBase58(),
          type: "Solana",
        },
      ]);
      setCurrentAccount({
        id: `solana ${CurrenSolanatIndex}`,
        privateKey: bs58.encode(keypair.secretKey),
        publicKey: keypair.publicKey.toBase58(),
        type: "Solana",
      });
    } else {
      setCurrentEthereumIndex((prev) => prev + 1);
      path = `m/44'/60'/${CurrenEthereumIndex}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);

      const child = hdNode.derivePath(path);
      const privateKey = child.privateKey;
      const wallets = new Wallet(privateKey);
      const add = setAllWallets((prev) => [
        {
          id: `Ethereum ${CurrenEthereumIndex}`,
          privateKey: wallets.privateKey,
          publicKey: wallets.address,
          type: "Ethereum",
        },
        ...prev,
      ]);
      setCurrentAccount({
        id: `Ethereum ${CurrenEthereumIndex}`,
        privateKey: wallets.privateKey,
        publicKey: wallets.address,
        type: "Ethereum",
      });
    }

    console.log(allWallets);
    console.log("Done ! added");
  };

  const addNewMenomic = async () => {
    const mn = generateMnemonic();
    setMnemonic(mn);
    console.log(mn);
    localStorage.setItem("Mnemonic", mn);
  };

  const getBalance = async () => {
    const result = await axios.post("http://localhost:3000/api/getBalance", {
      publicKey: currentAccount?.publicKey,
      type: currentAccount?.type,
    });
    if (result.status !== 200) {
      return console.error("Error on fetching balance from backend");
    }
    setAmount(result.data.data);
  };

  const sendTransition = async (to: string, sendAmountToSender: string) => {
    if (!currentAccount) return;
    console.log("Sending to:", to, "length:", to.length);

    if (currentAccount.type === "Solana") {
      try {
        if (amount === 0) {
          console.error("You do not have sufficemt balance to send");
          alert("You do not have sufficemt balance to send");
          return;
        }

        console.log(amount, typeof amount);

        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();

        const instraction = SystemProgram.transfer({
          fromPubkey: new PublicKey(currentAccount.publicKey),
          toPubkey: new PublicKey(to),
          lamports: Number(sendAmountToSender) * LAMPORTS_PER_SOL,
        });

        const messageV0 = new TransactionMessage({
          payerKey: new PublicKey(currentAccount.publicKey),
          recentBlockhash: blockhash,
          instructions: [instraction],
        }).compileToV0Message();

        const transaction = new VersionedTransaction(messageV0);

        const keypair = Keypair.fromSecretKey(
          bs58.decode(currentAccount.privateKey)
        );
        transaction.sign([keypair]);

        const txid = await connection.sendTransaction(transaction, {
          skipPreflight: false,
          maxRetries: 3,
        });

        await connection.confirmTransaction({
          signature: txid,
          blockhash,
          lastValidBlockHeight,
        });

        alert("✔✔ DONE");

        return txid;
      } catch (error) {
        console.error(error);
        alert("failed solana transition");
        return;
      }
    } else if (currentAccount.type === "Ethereum") {
      try {
        console.log("Sending to:", to, "length:", to.length);
        console.log(amount, typeof(amount));
        if (amount === "0.0") {
          console.error("You do not have sufficemt balance to send");
          alert("You do not have sufficemt balance to send");
          return;
        }
        //load wallet
        const cleanTo = to.trim();
        if (!ethers.isAddress(cleanTo)) {
          throw new Error("Invalid recipient address");
        }

        const wallet = new ethers.Wallet(
          currentAccount.privateKey,
          EthereumProvider
        );

        // Build and send
        const tx = await wallet.sendTransaction({
          to: cleanTo,
          value: ethers.parseEther(sendAmountToSender),
        });

        await tx.wait();

        alert(`✅ Ethereum Tx Sent! ${tx.hash}`);
        return tx.hash;
      } catch (error) {
        console.error(error);
        alert("Error in Ethereum");
        return;
      }
    }
  };

  useEffect(() => {
    const isThereMenomic = localStorage.getItem("Mnemonic");

    if (!isThereMenomic) addNewMenomic();
    else {
      console.log(isThereMenomic);
      setMnemonic(isThereMenomic);
    }
  }, []);

  useEffect(() => {
    if (currentAccount) getBalance();
  }, [currentAccount]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-neutral-950 text-white">
      <div className="w-[60%] border-2 h-full flex flex-col items-center">
        <div className="h-20 flex justify-center items-center">
          <h1 className="text-2xl font-medium">Current Account :-</h1>
          <Input id="link" defaultValue={currentAccount?.publicKey} readOnly />
        </div>
        <div className="w-full h-60 flex flex-col items-center justify-center border-2 ">
          {/* Balances */}
          <h1 className="text-6xl font-bold text-gray-50 hover:underline transition-transform hover:shadow-2xl">
            {currentAccount?.type === "Solana" ? "SOL" : "ETH"} {amount}
          </h1>
          {/* Services */}
          <div className="mt-5 gap-2 h-20 flex  items-center justify-center w-full">
            {/* Mnemonc */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="w-1/5 flex justify-center items-center h-full rounded-2xl bg-neutral-800 cursor-pointer hover:bg-neutral-700 transition-colors">
                  <p className="text-gray-300 font-normal">Your Secret</p>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Your Secret Pharase</DialogTitle>
                  <DialogDescription>
                    Anyone who has this Pharase can take your all money and able
                    to make you poor.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="grid grid-cols-3 flex-1 gap-2">
                    {mnemonic.split(" ").map((value: string) => (
                      <Input
                        key={value}
                        id="link"
                        defaultValue={value}
                        readOnly
                      />
                    ))}
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* Send */}
            <Dialog>
              <form className="w-1/5 flex justify-center items-center h-full rounded-2xl bg-neutral-800 cursor-pointer hover:bg-neutral-700 transition-colors">
                <DialogTrigger asChild>
                  <div className="w-full flex justify-center items-center h-full rounded-2xl bg-neutral-800 cursor-pointertransition-colors">
                    <p className="text-gray-300 font-normal">Send</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Send Money</DialogTitle>
                    <DialogDescription>
                      Send money to other easyly
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name-1">
                        Reciver {currentAccount?.type} Public Id
                      </Label>
                      <Input
                        value={senderPublicId}
                        onChange={(e) => setSenderPublicId(e.target.value)}
                        id="public-Id"
                        name="public-Id"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="username-1">Amout</Label>
                      <Input
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        id="amount"
                        name="amount"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={async () =>
                        await sendTransition(senderPublicId, sendAmount)
                      }
                      type="submit"
                    >
                      Send
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
            {/* add buton */}
            <Dialog>
              <form className="w-1/5 flex justify-center items-center h-full rounded-2xl bg-neutral-800 cursor-pointer hover:bg-neutral-700 transition-colors">
                <DialogTrigger asChild>
                  <div>
                    <p className="text-gray-300 font-normal">Add</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Account</DialogTitle>
                    <DialogDescription>
                      Add the new wallet just in one click
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name-1">Select Wallet Type</Label>
                      <Select
                        defaultValue="Solana"
                        onValueChange={(value: wallet) => setWalletType(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a wallet Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="Solana">
                              <img
                                src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
                                className="h-7 w-7"
                              />
                              <Label>Solana</Label>{" "}
                            </SelectItem>
                            <SelectItem value="Ethereum">
                              <img
                                src="https://1000logos.net/wp-content/uploads/2023/01/Ethereum-logo.png"
                                className="h-7 w-7"
                              />
                              <Label>Ethereum</Label>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="username-1">Username</Label>
                      <Input
                        id="username-1"
                        name="username"
                        defaultValue="@peduarte"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={addWallet} type="submit">
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
            {/* Buy */}
            <div
              className="w-1/5  flex justify-center items-center h-full rounded-2xl bg-neutral-800 cursor-pointer hover:bg-neutral-700 transition-colors"
              onClick={() => {}}
            >
              <p className="text-gray-300 font-normal">Buy</p>
            </div>
          </div>
        </div>
        {/* Accounts */}
        <div className="w-full h-3/5 flex flex-col gap-4 items-center overflow-y-auto border-2 py-5">
          {allWallets.map((wallet: AllWallet) => (
            <div
              key={wallet.id}
              className="w-4/5 h-20 flex rounded-2xl items-center px-2 bg-neutral-900 justify-between hover:bg-neutral-800 transition-colors cursor-pointer"
              onClick={() => setCurrentAccount(wallet)}
            >
              <div className="flex h-full gap-2 items-center">
                <img
                  src={wallet.type === "Solana" ? SolanaLogo : EthereumLogo}
                  className="h-4/5 rounded-full border-none"
                />
                <div className="flex flex-col ">
                  <h1 className="text-2xl font-semibold">{wallet.type}</h1>
                  <p className="font-normal  text-base text-neutral-100 max-w-90 truncate">
                    {wallet.publicKey}
                  </p>
                </div>
              </div>
              <h1 className="text-2xl font-semibold">$20341</h1>
            </div>
          ))}
          <div className="w-4/5 h-20 rounded-2xl bg-neutral-900"></div>
          <div className="w-4/5 h-20 rounded-2xl bg-neutral-900"></div>
          <div className="w-4/5 h-20 rounded-2xl bg-neutral-900"></div>
        </div>
      </div>
    </div>
  );
}