import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

const connection = new Connection("https://api.devnet.solana.com");

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {publicKey} = body;

        const success = await connection.requestAirdrop(new PublicKey(publicKey), LAMPORTS_PER_SOL);

        console.log(success);

        return NextResponse.json({
            message: "successfuly airdrop",
            data: success
        })

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Error",
            data: error
        }, {status: 500})
    }
}