import { NextRequest, NextResponse } from "next/server";
import {
  airdropFactory,
  appendTransactionMessageInstructions,
  assertIsTransactionWithinSizeLimit,
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
import { getCreateAccountInstruction } from "@solana-program/system";
import {
  getInitializeAccount2Instruction,
  getInitializeMintInstruction,
  getMintSize,
  getTokenSize,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";

const rpc = createSolanaRpc("https://api.devnet.solana.com");
const rpcSubscriptions = createSolanaRpcSubscriptions(
  "wss://api.devnet.solana.com"
);

export async function POST(req: NextRequest) {
  try {
    const feePayer = await generateKeyPairSigner();

    await airdropFactory({ rpc, rpcSubscriptions })({
      recipientAddress: feePayer.address,
      lamports: lamports(1_000_000_000n),
      commitment: "confirmed",
    });

    const mint = await generateKeyPairSigner();

    const space = BigInt(getMintSize());

    const rent = await rpc.getMinimumBalanceForRentExemption(space).send();

    const createAccountInstraction = getCreateAccountInstruction({
      lamports: rent,
      newAccount: mint,
      space,
      payer: feePayer,
      programAddress: TOKEN_PROGRAM_ADDRESS,
    });

    const initializeMintInstruction = getInitializeMintInstruction({
      mint: mint.address,
      mintAuthority: feePayer.address,
      decimals: 9,
    });

    const instractions = [createAccountInstraction, initializeMintInstruction];

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const transactionMessage = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions(instractions, tx)
    );

    const signedTransition = await signTransactionMessageWithSigners(
      transactionMessage
    );

    assertIsTransactionWithinSizeLimit(signedTransition);

    await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
      signedTransition,
      { commitment: "confirmed" }
    );

    const transactionSignature = getSignatureFromTransaction(signedTransition);

    console.log("Mint Address:", mint.address);
    console.log("Transaction Signature:", transactionSignature);

    const tokenAccount = await generateKeyPairSigner();

    const tokenAccountSpace = BigInt(getTokenSize());

    const tokenAccountRent = await rpc
      .getMinimumBalanceForRentExemption(tokenAccountSpace)
      .send();

    const createTokenAccountInstraction = getCreateAccountInstruction({
      lamports: tokenAccountRent,
      payer: feePayer,
      newAccount: tokenAccount,
      space: tokenAccountSpace,
      programAddress: TOKEN_PROGRAM_ADDRESS,
    });

    const initializeTokenAccountInstraction = getInitializeAccount2Instruction({
      account: tokenAccount.address,
      mint: mint.address,
      owner: feePayer.address,
    });

    const instraction2 = [
      createTokenAccountInstraction,
      initializeTokenAccountInstraction,
    ];

    const tokenAccountMessage = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions(instraction2, tx)
    );

    const signedTokenAccountTx = await signTransactionMessageWithSigners(
      tokenAccountMessage
    );

    assertIsTransactionWithinSizeLimit(signedTokenAccountTx);

    await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
      signedTokenAccountTx,
      { commitment: "confirmed" }
    );

    const transactionSignature2 =
      getSignatureFromTransaction(signedTokenAccountTx);

    console.log("Token Account Address:", tokenAccount.address);
    console.log("Transaction Signature:", transactionSignature2);

    return NextResponse.json(
      {
        message: "Success",
        data: {
          tokenAccountAddress: tokenAccount.address,
          transationSignature: transactionSignature2,
          tokenMintaddress: mint.address,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Failed to do this action sorry",
      data: error,
    });
  }
}
