import { getCreateAccountInstruction } from "@solana-program/system";
import {
  address,
  airdropFactory,
  appendTransactionMessageInstructions,
  assertIsTransactionWithinSizeLimit,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";

import {
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { NextRequest, NextResponse } from "next/server";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const rpc = createSolanaRpc("https://api.devnet.solana.com");
const rpcSubscriptions = createSolanaRpcSubscriptions(
  "ws://api.devnet.solana.com"
);

async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {feePayerSecret, freezeAthorityPublicKey } = data;

    const feePayer = Keypair.fromSecretKey(Uint8Array.from(feePayerSecret))
    const feePayer2 = await createKeyPairSignerFromBytes(feePayer.secretKey)

    const InitialBalance = await rpc.getBalance(address(feePayer.publicKey.toBase58()));
    const balanceInSQL = Number(InitialBalance) / LAMPORTS_PER_SOL;
    if (balanceInSQL < 1) {
      console.log(`Balance is ${balanceInSQL}`);
      await airdropFactory({ rpc, rpcSubscriptions })({
        recipientAddress: address(feePayer.publicKey.toBase58()),
        lamports: lamports(1_000_000_000n),
        commitment: "confirmed",
      });
    }
    console.log(`Balance is ${balanceInSQL}`);

    const mint = await generateKeyPairSigner();
    console.log(`Token account info: ${mint}`);

    const space = BigInt(getMintSize());
    const rent = await rpc.getMinimumBalanceForRentExemption(space).send();
    console.log(`Rent ammount ${rent}`);

    const createAccountInstruction = getCreateAccountInstruction({
      payer: await createKeyPairSignerFromBytes(feePayer.secretKey),
      newAccount: mint,
      lamports: rent,
      programAddress: TOKEN_PROGRAM_ADDRESS,
      space,
    });

    const initializeMintInstruction = getInitializeMintInstruction({
      mint: mint.address,
      decimals: 9,
      mintAuthority: freezeAthorityPublicKey,
    });

    const instraction = [createAccountInstruction, initializeMintInstruction];

    const {
      value: { lastValidBlockHeight, blockhash },
    } = await rpc.getLatestBlockhash().send();

    const transactionMessage = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayerSigner(feePayer2, tx),
      (tx) =>
        setTransactionMessageLifetimeUsingBlockhash(
          { lastValidBlockHeight, blockhash },
          tx
        ),
      (tx) => appendTransactionMessageInstructions(instraction, tx)
    );

    const signedTransition = await signTransactionMessageWithSigners(
      transactionMessage
    );

    assertIsTransactionWithinSizeLimit(signedTransition);

    await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
      signedTransition,
      {
        commitment: "confirmed",
      }
    );

    const transitionSignature = getSignatureFromTransaction(signedTransition);
    console.log(`signature info, ${transitionSignature}`);
    NextResponse.json(
      {
        mint: mint.address,
      },
      { status: 500 }
    );
  } catch (error) {
    console.error(error);
    NextResponse.json(
      {
        message: "Something went wrong",
        error: error,
      },
      { status: 500 }
    );
  }
}
