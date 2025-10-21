import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

const RPC_URL = "https://api.mainnet-beta.solana.com"; // CORS-enabled public RPC
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

interface Info {
  symbol: string;
  name: string;
  image: string;
}

// Derive Metadata PDA
async function getMetadataPDA(mint: PublicKey): Promise<PublicKey> {
  const [pda] = await PublicKey.findProgramAddressSync(
      [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );
    console.log("pda:- ", pda);
    return pda;
}

const TokenInfo = () => {
  const { publicKey } = useWallet();
  const [info, setInfo] = useState<Info>();
  const [isActive, setIsActive] = useState(false);

  const load = async (mintAddress: string) => {
    if (!publicKey) {
      console.error("Connect your wallet first");
      return;
    }

    try {
      const connection = new Connection(RPC_URL, "confirmed");
      const mintPublicKey = new PublicKey(mintAddress);
      const metadataPDA = await getMetadataPDA(mintPublicKey);

      // Fetch account info
      const accountInfo = await connection.getAccountInfo(metadataPDA);
      if (!accountInfo) {
        console.error("No metadata account found for this token");
        return;
      }

      console.log("accout info:- ", accountInfo);

      // Parse metadata URI from account data (simple method)
      const data = accountInfo.data;
      const text = data.toString();
      const uriMatch = text.match(/https?:\/\/.*\.json/);
      if (!uriMatch) {
        console.error("Could not find URI in metadata account");
        return;
      }
      console.log("data is:- ", data);

      const uri = uriMatch[0];

      // Fetch off-chain JSON metadata
      const resp = await fetch(uri);
      if (!resp.ok) throw new Error("Failed to fetch metadata JSON");
      const json = await resp.json();

      const tokenInfo: Info = {
        name: json.name,
        symbol: json.symbol,
        image: json.image,
      };

      setInfo(tokenInfo);
      setIsActive(true);
    } catch (err) {
      console.error("Error loading token metadata:", err);
    }
  };

  return (
    <div className="w-full h-100 flex flex-col justify-center items-center rounded-2xl border p-4 gap-4">
      <Button onClick={() => load("2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo")}>
        Load Token
      </Button>

      {isActive && info && (
        <div className="flex flex-col items-center gap-2">
          <img
            src={info.image}
            alt={info.name}
            className="h-20 w-20 rounded-full object-cover"
          />
          <Label>{info.symbol}</Label>
          <Label>{info.name}</Label>
        </div>
      )}
    </div>
  );
};

export default TokenInfo;
