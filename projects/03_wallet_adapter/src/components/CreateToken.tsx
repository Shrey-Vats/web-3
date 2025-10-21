import {
  getAccount,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { useState } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Label } from "./ui/label";
import { useWallet } from "@solana/wallet-adapter-react";
import { Input } from "./ui/input";

interface Payer {
  publicKey: PublicKey;
  secretKey: Uint8Array<ArrayBufferLike>;
}

function CreateToken() {
  const [loading, setLoading] = useState<boolean>(false);
  const [TokenAddress, setTokenAddress] = useState<PublicKey>();
  const [payers, setPayer] = useState<Payer>();
  const [amount, setAmount] = useState<string>("0");

  const { publicKey } = useWallet();

  const connection = new Connection(clusterApiUrl("devnet"));

  const handlerCreate = async () => {
    setLoading(true);
    if (!publicKey) {
      console.error("Connect to wallet first");
      return;
    }
    const payer = Keypair.fromSecretKey(
      new Uint8Array([150,191,92,67,91,235,116,85,73,240,85,42,193,79,118,152,224,30,106,222,75,69,40,131,59,49,62,2,247,157,182,199,106,119,42,115,24,93,128,202,181,237,47,210,162,181,91,98,232,224,184,133,17,29,75,187,110,37,221,199,10,52,218,147])
    );

    try {
      const balance = await connection.getBalance(payer.publicKey);
      console.log(balance)
      if (balance === 0) {
        console.log("Airdropping SOL to payer...");
        const sig = await connection.requestAirdrop(
          payer.publicKey,
          2 * LAMPORTS_PER_SOL
        );
        const block = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          blockhash: block.blockhash,
          lastValidBlockHeight: block.lastValidBlockHeight,
          signature: sig
        }, "confirmed");
      }
 
      // setTokenAddress(mint);
      setPayer(payer);
    } catch (error) {
      console.error(error);
      return;
    } finally {
      setLoading(false);
    }
  };
  const handlerToken = async () => {
    try {
      if (!publicKey) {
        console.error("Connect to wallet first");
        return;
      }

      if (!payers || !TokenAddress) {
        console.error("Payer or token address is not define");
        return;
      }

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payers,
        TokenAddress,
        publicKey
      );

      console.log("Token account :- ", tokenAccount.address.toBase58());
      await new Promise((resolve) => setTimeout(resolve, 10000));

      const tokenAccountInfo = await getAccount(
        connection,
        tokenAccount.address
      );
      console.log("Token supply :- ", tokenAccountInfo.amount);

      await mintTo(
        connection,
        payers,
        TokenAddress,
        tokenAccount.address,
        publicKey,
        LAMPORTS_PER_SOL * Number(amount)
      );
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return (
    <div>
      <Button onClick={handlerCreate}>
        {loading ? (
          <div className="flex items-center gap-4">
            <Spinner />
          </div>
        ) : (
          "Create Token"
        )}
      </Button>
      {!loading && TokenAddress && payers ? (
        <div className="w-full h-100 flex items-center justify-center">
          <Input
            placeholder="Enter Amount"
            required
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
          <Label>Mint token to your wallet</Label>
          <Button onClick={handlerToken}>Mint Token</Button>
        </div>
      ) : null}
    </div>
  );
}

export default CreateToken;