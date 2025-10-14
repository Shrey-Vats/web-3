import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { publicKey } = body;

    const res = await axios.post("https://api.devnet.solana.com", {
      jsonrpc: "2.0",
      method: "getBalance",
      params: [publicKey],
      id: 1,
    });

    // console.log(res);

    if (res.status < 200 || res.status >= 300) {
      console.error(res);
      return NextResponse.json(
        { message: "Error fetching Solana balance", data: res.data },
        { status: 400 }
      );
    }

    const lamports = res.data.result?.value;
    const amount = lamports;
    console.log(amount, lamports);

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
