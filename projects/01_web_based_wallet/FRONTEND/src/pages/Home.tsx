import Navbar from "@/components/Navbar";
import type { vaults } from "@/components/Vaults";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import WalletGenrateFields from "@/components/walletGenrateFields";
import Vaults from "@/components/Vaults";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/Combobox";

export interface WalletType {
  publicKey: string;
  privateKey: string;
}

export interface TransactionRecord {
  amount: string;
  signature: string;
}

export interface TransactionRecords {
  [publicKey: string]: TransactionRecord[];
}

function Home() {
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [activeWallet, setActiveWallet] = useState<WalletType | null>(null);
  const [mainWallet, setMainWallet] = useState(null);
  const [records, setRecords] = useState<TransactionRecord[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Generate new wallet
  // const addWallet = () => {
  //   if (isLoading) return;
  //   setIsLoading(true);

  //   const storedRecords: TransactionRecords = JSON.parse(
  //     localStorage.getItem("records") || "{}"
  //   );

  //   const newHDWallet = ethers.Wallet.createRandom();
  //   const newWallet: WalletType = {
  //     publicKey: newHDWallet.address,
  //     privateKey: newHDWallet.privateKey,
  //   };

  //   setWallets((prev) => [...prev, newWallet]);
  //   setActiveWallet(newWallet);
  //   setMainWallet(newWallet ? new ethers.Wallet(newWallet.privateKey) : null);

  //   // Store in localStorage
  //   localStorage.setItem("wallets", JSON.stringify([...wallets, newWallet]));
  //   localStorage.setItem("currentWallet", JSON.stringify(newWallet));
  //   storedRecords[newWallet.publicKey] = [];
  //   localStorage.setItem("records", JSON.stringify(storedRecords));

  //   toast.success("Wallet generated successfully!", {
  //     className: "border border-green-600 bg-black/10 text-2xl text-green-500",
  //   });

  //   setIsLoading(false);
  // };

  // Add transaction record for active wallet
  // const addTransactionRecord = async () => {
  //   if (!activeWallet || !mainWallet) {
  //     toast.error("No active wallet selected");
  //     return;
  //   }

  //   const signature = await mainWallet.signMessage(amount || "0");
  //   const newRecord: TransactionRecord = { amount, signature };

  //   const storedRecords: TransactionRecords = JSON.parse(
  //     localStorage.getItem("records") || "{}"
  //   );

  //   storedRecords[activeWallet.publicKey] = [
  //     ...(storedRecords[activeWallet.publicKey] || []),
  //     newRecord,
  //   ];

  //   localStorage.setItem("records", JSON.stringify(storedRecords));
  //   setRecords(storedRecords[activeWallet.publicKey]);
  //   setAmount(""); // Reset input
  //   toast.success("Transaction added!");
  // };

  // Handle wallet selection
  useEffect(() => {
    if (!value) return;

    const selected = wallets.find((w) => w.publicKey === value) || null;
    setActiveWallet(selected);

    const storedRecords: TransactionRecords = JSON.parse(
      localStorage.getItem("records") || "{}"
    );
    setRecords(selected ? storedRecords[selected.publicKey] || [] : []);
  }, [value, wallets]);

  // Load wallets & records on mount
  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets");
    const currentWallet = localStorage.getItem("currentWallet");
    const storedRecords = localStorage.getItem("records");

    if (storedWallets) setWallets(JSON.parse(storedWallets));
    if (currentWallet) setActiveWallet(JSON.parse(currentWallet));

    if (storedRecords && currentWallet) {
      const parsedRecords: TransactionRecords = JSON.parse(storedRecords);
      const active = JSON.parse(currentWallet) as WalletType;
      setRecords(parsedRecords[active.publicKey] || []);
      // setMainWallet(new ethers.Wallet(active.privateKey));
    }
  }, []);

  if (!activeWallet)
    return <WalletGenrateFields onClick={() => {}} isLoading={isLoading} />;

  return (
    <div className="min-h-screen w-screen flex justify-center bg-gray-950">
      <div className="w-4/6 min-h-full rounded-lg shadow-lg mb-5 p-6">

        <div className="w-full flex flex-col justify-center items-center mt-15">
          <h1 className="text-7xl font-bold">$ 200</h1>

          <div className="mt-5 flex gap-4">

            <Dialog>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // addTransactionRecord();
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">Send</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Send the coin</DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="userPrivateKey">Your Private Key</Label>
                      <Input
                        id="userPrivateKey"
                        readOnly
                        value={activeWallet.privateKey}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {/* <Button onClick={addTransactionRecord} type="submit">
                      Save changes
                    </Button> */}
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>

            <Button size="lg" onClick={() => {}}>
              Add
            </Button>
          </div>
        </div>

        <Vaults
          vaults={records.map((record, id) => ({
            id: id.toString(),
            publicKey: activeWallet.publicKey,
            secretKey: activeWallet.privateKey,
            signature: record.signature,
          }))}
        />
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default Home;
