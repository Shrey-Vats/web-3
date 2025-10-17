import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function RequestAirdrop() {
  const [amount, setAmount] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const { connection } = useConnection();
    const wallet = useWallet();

  async function requestAirdrop() {
        try {
      setStatus("loading");
      setError(null);

      if (!wallet.publicKey) {
        throw new Error("You must connect your wallet first.");
        }

      const lamports = Number(amount) * LAMPORTS_PER_SOL;
      if (isNaN(lamports) || lamports <= 0) {
        throw new Error("Please enter a valid SOL amount.");
      }

      const signature = await connection.requestAirdrop(wallet.publicKey, lamports);
      await connection.confirmTransaction(signature, "confirmed");

      setStatus("success");
      setAmount("");
    } catch (err: any) {
      console.error("Airdrop request failed:", err);
      setError(err.message || "Unknown error occurred.");
      setStatus("error");
        }
    }

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 p-6">
      <h1 className="text-2xl font-semibold">Request Airdrop</h1>

      <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Enter amount (SOL)"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          className="w-48"
          />
          <Button onClick={requestAirdrop} disabled={status === "loading"}>
          {status === "loading" ? "Processing..." : "Request Airdrop"}
          </Button>
        </div>

        {status === "success" && (
        <Alert className="mt-4 border-green-500/50 bg-green-100/30">
          <AlertTitle>✅ Airdrop Request Successful!</AlertTitle>
            <AlertDescription>
            Your airdrop request has been successfully processed. Tokens will be reflected in your wallet shortly.
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
        <Alert className="mt-4 border-red-500/50 bg-red-100/30">
          <AlertTitle>❌ Airdrop Request Failed</AlertTitle>
            <AlertDescription>
            Something went wrong while processing your airdrop request. <br />
              <span className="font-semibold">Error:</span> {error}
            </AlertDescription>
          </Alert>
        )}
      </div>
  );
}

