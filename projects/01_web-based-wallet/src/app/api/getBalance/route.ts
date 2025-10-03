import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";
import { formatEther } from "ethers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
  const { publicKey, type } = body;

  let serverCall;
  let amount;
  if (type === "Solana") {
    serverCall = await axios.post(
      "https://solana-mainnet.g.alchemy.com/v2/-ZOXWGksXSCTgRC9qT3FY",
      {
        jsonrpc: "2.0",
        method: "getBalance",
        params: [publicKey],
        id: 1,
      }
    );
    if (serverCall.status !== 200 && serverCall.status !== 201) {
      console.error(serverCall);
      return NextResponse.json(
        {
          message: "Error during fetching data",
          data: serverCall.data,
        },
        { status: 400 }
      );
    }

    const Lamposts = serverCall.data.result?.value;
    const sql = Lamposts / LAMPORTS_PER_SOL;
    amount = sql;
  } else {
    serverCall = await axios.post(
      "https://eth-mainnet.g.alchemy.com/v2/-ZOXWGksXSCTgRC9qT3FY",
      {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [publicKey, "latest"],
        id: 1,
      }
    );
    if (serverCall.status !== 200 && serverCall.status !== 201) {
      console.error(serverCall);
      return NextResponse.json(
        {
          message: "Error during fetching data",
          data: serverCall.data,
        },
        { status: 400 }
      );
    }
    const ether = formatEther(serverCall.data.result);
    amount = ether;
  }

  return NextResponse.json(
    {
      message: "Data have been sent",
      data: amount,
    },
    { status: 200 }
  );
  } catch (error) {
    console.error(error);
    return NextResponse.json({
        message: "Error during getting balance",
        data: error
     }, {status: 500})
  }
}
