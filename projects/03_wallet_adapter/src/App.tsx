"use client";
import { RequestAirdrop } from "@/components/RequestAirdrop";
import ShowAllTokensBalance from "@/components/ShowAllTokensBalance";

import { ConnectWallet } from "./components/ConnectWallet";
import { WalletConnectionProvider } from "./provider/WalletConnectionProvider";
import SendTransaction from "./components/sendTransaction";
import SignMessage from "./components/SignMessage";

export default function App() {
  return (
    <div className="h-screen w-screen">
      <WalletConnectionProvider>
        <ConnectWallet />
        <ShowAllTokensBalance />
        <RequestAirdrop />
        <SignMessage />
        <SendTransaction />
      </WalletConnectionProvider>
    </div>
  );
}
