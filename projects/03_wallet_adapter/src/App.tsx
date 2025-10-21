"use client";
import { RequestAirdrop } from "@/components/RequestAirdrop";
import ShowAllTokensBalance from "@/components/ShowAllTokensBalance";

import { ConnectWallet } from "./components/ConnectWallet";
import { WalletConnectionProvider } from "./provider/WalletConnectionProvider";
import SendTransaction from "./components/sendTransaction";
import SignMessage from "./components/SignMessage";
import CreateToken from "./components/CreateToken";
import FindAllTokens from "./components/FindAllTokens";

export default function App() {
  return (
    <div className="min-h-screen w-screen">
      <WalletConnectionProvider>
        <ConnectWallet />
        <ShowAllTokensBalance />
        <RequestAirdrop />
        <SignMessage />
        <SendTransaction />
        <CreateToken />
        <FindAllTokens />
      </WalletConnectionProvider>
    </div>
  );
}
