import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";
import { formatEther } from "ethers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { publicKey, type } = body;
    console.log(body);
    let amount: number;

    if (type === "Solana") {
      const res = await axios.post(
        "https://api.devnet.solana.com",
        {
          jsonrpc: "2.0",
          method: "getBalance",
          params: [publicKey],
          id: 1,
        }
      );

      // console.log(res);

      if (res.status < 200 || res.status >= 300) {
        console.error(res);
        return NextResponse.json(
          { message: "Error fetching Solana balance", data: res.data },
          { status: 400 }
        );
      }

      const lamports = res.data.result?.value;
      amount = lamports / LAMPORTS_PER_SOL; // SOL
      console.log(amount, lamports)
    } else {
      const res = await axios.post(
       "https://eth-mainnet.g.alchemy.com/v2/-ZOXWGksXSCTgRC9qT3FY",
        {
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [publicKey, "latest"],
          id: 1,
        }
      );

      if (res.status < 200 || res.status >= 300) {
        console.error(res);
        return NextResponse.json(
          { message: "Error fetching Ethereum balance", data: res.data },
          { status: 400 }
        );
      }

      amount = parseFloat(formatEther(res.data.result)); // ETH
    }

    console.log(amount)
    return NextResponse.json(
      { message: "Balance fetched", data: amount },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching balance", data: error },
      { status: 500 }
    );
  }
}
