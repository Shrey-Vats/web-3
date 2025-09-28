import { useEffect, useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/theme-provider";
import Vaults, { type vaults } from "./components/Vaults";
import WalletGenrateFields from "./components/walletGenrateFields";
import { toast, Toaster } from "sonner";
import {ethers} from "ethers";

function App() {

  const [wallet, setWallets] = useState<vaults[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addWallests = async () => {
    if(isLoading) return;
    setIsLoading(true);

    const wallets = ethers.Wallet.createRandom();

    const publicKey = wallets.address;
    const privateKey = wallets.privateKey;

    let secretPhrase;
    if (input.trim().length === 0) {
      secretPhrase = await wallets.signMessage(input);
    } else {
      secretPhrase = await wallets.signMessage("Default secret phrase");
    }

    const newWallet: vaults = {
      id: Math.random().toString(36).substring(2, 15),
      publicKey,
      secretKey: privateKey,
      signature : secretPhrase
    };

    localStorage.setItem("wallets", JSON.stringify([...wallet, newWallet]));
    setWallets((prevWallets) => [...prevWallets, newWallet]);
    toast.success("Wallet generated successfully!", {
      className: "border border-green-600 bg-black/10 text-2xl text-green-500"
    });

    setInput("");
    setIsLoading(false);
  }

  useEffect(() => {
    const fetchWallets = async () => {
      const storedWallets = localStorage.getItem("wallets");
      if (storedWallets) {
        setWallets(JSON.parse(storedWallets));
      }
    }
    fetchWallets();
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen w-screen flex justify-center bg-gray-950">
        <div className="w-4/6 min-h-full rounded-lg shadow-lg mb-5 p-6">
          <Navbar />

          <div className="mt-10 flex flex-col">
            <h1 className="text-6xl font-extrabold text-white">Shrey Vats</h1>
            <p className="text-lg mt-2 text-gray-200 font-medium">
              A personal web3 wallet for{" "}
              <span className="text-blue-500">Harkirat cohort</span> 3.0 assignment
            </p>
          </div>

          <WalletGenrateFields
            isLoading={isLoading}
            input={input}
            setInput={setInput}
            onClick={addWallests}
          />

          <Vaults vaults={wallet} />
        </div>

        <Toaster position="top-right" richColors />
      </div>
    </ThemeProvider>
  );
}

export default App;
