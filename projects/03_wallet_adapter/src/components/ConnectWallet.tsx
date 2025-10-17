import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';

export function ConnectWallet() {
  const { publicKey, connected } = useWallet();

  const handleClick = () => {
    if (!connected) {
      alert('Please connect your wallet first!');
      return;
    }
    console.log("Wallet connected with:", publicKey?.toBase58());
  };
    
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Built-in wallet button */}
      <WalletMultiButton />

      {/* Your custom button */}
      <Button onClick={handleClick}>Log Wallet</Button>

      {connected && (
        <p className="text-green-500">
          Connected: {publicKey?.toBase58()}
        </p>
      )}
    </div>
  );
}

