import { Button } from "@/components/ui/button";
import Vaults2 from "@/components/Vaults2";
import { useEffect, useState } from "react";
import type { TransactionRecords, WalletType } from "./Home";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { toast } from "sonner";
// import { generateMnemonic, mnemonicToSeedSync } from "bip39";
// import { derivePath } from "ed25519-hd-key"
import bs58 from "bs58";

import axios from "axios";
function AllWallets() {
  const [wallets, setwallets] = useState<WalletType[]>([]);
  const [activeWallet, setActiveWallet] = useState<WalletType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function byteToString(value: any) {
    return bs58.encode(value);
  }
// m / purpose' / coin_type' / account' / change / address_index.

  async function derivedSeedGenrater() {
    const result = await axios.post("http://localhost:3000");

    console.log(result);
    console.log("key :- ", result.data.code.data);
    console.log("secret :- ", result.data.secret);

    return result.data.secret
  }

  const addWallet = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const storedRecords: TransactionRecords = JSON.parse(
      localStorage.getItem("records") || "{}"
    );
    
    //genrate wallets
    const secret =  await derivedSeedGenrater()

    const keypair = Keypair.fromSecretKey(secret); 
   console.log("public: ", keypair.publicKey.toBase58())

    const newWallet: WalletType = {
      privateKey: byteToString(keypair.secretKey),
      publicKey: keypair.publicKey.toString(),
    };

    //store wallets
    setwallets((prev) => [...prev, newWallet]);
    setActiveWallet(newWallet);

    // Store in localStorage
    localStorage.setItem("wallets", JSON.stringify([...wallets, newWallet]));
    localStorage.setItem("currentWallet", JSON.stringify(newWallet));
    storedRecords[newWallet.publicKey] = [];
    localStorage.setItem("records", JSON.stringify(storedRecords));

    toast.success("Wallet generated successfully!", {
      className:
        "border border-green-600 bg-black/10 text-2xl text-green-500 bg-black/20",
    });

    setIsLoading(false);
  };

  useEffect(() => {
    const wallets = JSON.parse(localStorage.getItem("wallets")!);
    if (wallets) {
      setwallets(wallets);
    }
  }, []);

  return (
    <div className="min-h-screen w-screen flex justify-center bg-gray-950">
      <div className="w-4/6 min-h-full rounded-lg shadow-lg mb-5 p-6 mt-15">
        <div>
          <h1 className="text-6xl font-bold">Shrey Vats</h1>
          <p className="text-xl mt-2">
            Hi! This is assinment from{" "}
            <span className="text-blue-600 font-medium">
              Harkirat's Cohort 3
            </span>
          </p>
        </div>
        <div className="w-full h-20 mt-5 flex items-center justify-center">
          {/* <Input placeholder="Enter your message to add with wallets" /> */}
          <Button
            disabled={isLoading}
            onClick={addWallet}
            className={`h-20 w-40 ${
              isLoading ? `cursor-not-allowed opacity-50` : ``
            }`}
          >
            {isLoading ? "Loading" : "Add wallets"}
          </Button>
        </div>
        <Vaults2
          vaults={wallets.map((wallet) => ({
            publicKey: wallet.publicKey,
            privateKey: wallet.privateKey,
          }))}
        />
      </div>
    </div>
  );
}

export default AllWallets;
