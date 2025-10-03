import { Box } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import type { WalletType } from "@/pages/Home";
import { Combobox } from "./Combobox";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [currentWallet, setCurrentWallet] = useState<WalletType | null>(null);
  const [currentPublicKey, setCurrentPublicKey] = useState<string>("");
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [open, setopen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const navigate = useNavigate();
  useEffect(() => {
    const currentAccount = JSON.parse(localStorage.getItem("currentWallet")!);
    const wallets = JSON.parse(localStorage.getItem("wallets")!);

    setCurrentWallet(currentAccount);
    setCurrentPublicKey(currentAccount?.publicKey!);
    if (currentAccount) {
    } else {
      console.log("not their");
    }
    if (wallets) {
      setWallets(wallets);
    }

    console.log("current account :- ", currentAccount);
  }, []);

  useEffect(() => {
    console.log(value);
    // set the select value in loacal host
    const selectedWallet = wallets.find(
      (a: WalletType) => a.publicKey === value
    );

    console.log("selectValue", selectedWallet);
    if (selectedWallet || selectedWallet !== undefined){
      setCurrentWallet(selectedWallet!)
      let a1 = localStorage.getItem("currentWallet")
      let a = localStorage.setItem("currentWallet", JSON.stringify(currentWallet));
      console.log(a1, a)
    }

  }, [value]);

  return (
    <div className="w-full h-16 mt-2  flex fixed items-center py-2 border border-white/20  backdrop-blur-xl justify-between px-5 rounded-b-lg">
      <Box className="h-12 w-12" />
      <div>
        {currentWallet !== null ? (
          <Combobox
            currentWallet={currentPublicKey}
            setValue={setValue}      
            value={value}
            open={open}
            setOpen={setopen}
            Data={wallets.map((a) => a.publicKey)}
          />
        ) : (
          <h2> Add Wallet first - </h2>
        )}
        <Button onClick={() => navigate("/wallet")} className=" px-4 py-2 rounded">Add wallet</Button>
        <Button onClick={() => navigate("/")} variant={"secondary"} className=" px-4 py-2 rounded ml-2">
          Verify transition
        </Button>
      </div>
    </div>
  );
}

export default Navbar;
