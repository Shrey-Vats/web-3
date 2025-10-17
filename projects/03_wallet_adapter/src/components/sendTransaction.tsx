import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function sendTransaction() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState<number>(0.1);

  const sendtransaction = async () => {
    if (!publicKey) {
      console.error("❌ Wallet not connected");
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const recipientPublicKey = new PublicKey(recipient);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      console.log("✅ Transaction sent with signature:", signature);

      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        signature,
        ...latestBlockHash,
      });
      console.log("✅ Transation Comform");
      alert(`✅ Sent ${amount} SOL to ${recipient}`);
    } catch (error) {
      console.error("❌ Transaction failed:", error);
      alert(`Transaction failed`);
    }
  };
  return (
    <div>
       <form onSubmit={(e) => {
        e.preventDefault();
        sendtransaction();
       }} className="flex flex-col gap-2">
      <Input
        type="text"
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <Input
        type="number"
        step="0.01"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border p-2 rounded"
        required
      />
      <Button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Send SOL
      </Button>
    </form>
    </div>
  );
}

export default sendTransaction;
