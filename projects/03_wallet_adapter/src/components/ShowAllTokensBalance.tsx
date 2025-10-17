import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ShowAllTokensBalance() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function getBalanceAllTokens() {
    try {
      if (!wallet.publicKey) {
        throw new Error("Wallet not connected. Please connect your wallet first.");
      }

      setStatus("loading");
      setError(null);

      // const user = connection.getParsedTokenAccountsByOwner(wallet.publicKey, )
      const lamports = await connection.getBalance(wallet.publicKey);
      const solBalance = lamports / LAMPORTS_PER_SOL;

      setBalance(solBalance);
      setStatus("idle");
    } catch (err: any) {
      console.error("Failed to fetch balance:", err);
      setError(err.message || "Unable to fetch balance");
      setStatus("error");
    }
  }

  // Fetch whenever wallet changes
  useEffect(() => {
    if (wallet.publicKey) {
      getBalanceAllTokens();
    } else {
      setBalance(null);
    }
  }, [wallet.publicKey]);

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <h1 className="text-xl font-medium mb-2">Wallet Balance</h1>

      {status === "loading" && (
        <Alert className="border-blue-400/50 bg-blue-100/30 w-fit">
          <AlertTitle>Fetching Balance...</AlertTitle>
          <AlertDescription>Please wait while we fetch your balance.</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert className="border-red-500/50 bg-red-100/30 w-fit">
          <AlertTitle>❌ Error Fetching Balance</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {wallet.publicKey && balance !== null && (
        <h2 className="text-2xl font-semibold text-green-700 mt-3">
          {balance.toFixed(4)} SOL
        </h2>
      )}

      {!wallet.publicKey && (
        <Alert className="mt-3 border-yellow-400/50 bg-yellow-100/30 w-fit">
          <AlertTitle>⚠️ Wallet Not Connected</AlertTitle>
          <AlertDescription>Please connect your wallet to view your SOL balance.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default ShowAllTokensBalance;
