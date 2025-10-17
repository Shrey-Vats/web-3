import { Input } from "./ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import * as nacl from "tweetnacl";
import bs58 from "bs58";
import React, { useState } from "react";
import { Button } from "./ui/button";

function SignMessage() {
  const [message, setMessage] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const { publicKey, signMessage } = useWallet();

  const handleSign = async () => {
    try {
      if (!publicKey) {
        console.error("Wallet not connected!");
        return;
      }
      if (!signMessage) {
        console.error("Wallet does not support message signing!");
        return;
      }
      if (!message.trim()) {
        console.error("Please enter a message!");
        return;
      }

      const encodedMessage = new TextEncoder().encode(message);

      // Sign message using wallet
      const signed = await signMessage(encodedMessage);
      const signMessageBs58 = bs58.encode(signed);
      setSignature(signMessageBs58);

      // Verify signature
      const verified = nacl.sign.detached.verify(
        encodedMessage,
        signed,
        publicKey.toBytes()
      );

      console.log(`Signature: ${signMessageBs58}`);
      console.log(`Verified: ${verified}`);

      if (verified) {
        alert("✅ Signature verified successfully!");
      } else {
        alert("❌ Signature verification failed!");
      }
    } catch (error) {
      console.error("Signing failed:", error);
    }
  };

  return (
    <div className="w-full space-y-3">
      <Input
        placeholder="Enter your message"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <Button onClick={handleSign}>Sign Message</Button>

      {signature && (
        <p className="break-all text-sm text-gray-500">
          Signature: {signature}
        </p>
      )}
    </div>
  );
}

export default SignMessage;
