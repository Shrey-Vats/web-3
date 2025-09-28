import type { Request, Response } from "express";
import { generateUsername } from "unique-username-generator";
import prisma from "../utils/db.js";
import { ethers } from "ethers";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface UserPayload extends JwtPayload {
  userId: string;
  name: string;
}

const SECRET = process.env.SECRET || "shrey";


export const createRandomUser = async (req: Request, res: Response) => {
  try {
    const name = generateUsername();

    const user = await prisma.user.create({
      data: { name },
    });

    const token = jwt.sign(
      { userId: user.id, name: user.name },
      SECRET
    );

    res.setHeader("Authorization", `Bearer ${token}`);
    return res.status(201).json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating user" });
  }
};

export const createWallet = async (req: Request, res: Response) => {
  try {
    const { message } = req.body || {};
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token not found" });

    const user = jwt.verify(token, SECRET) as UserPayload;
    if (!user) return res.status(403).json({ message: "Unauthorized" });

    const wallet = ethers.Wallet.createRandom();
    const { address: publicKey, privateKey } = wallet;

    const signature = await wallet.signMessage(message || "");

    const dbWallet = await prisma.wallet.create({
      data: { privateKey, publicKey, userId: user.userId },
    });

    await prisma.signature.create({
      data: {
        walletId: dbWallet.id,
        signatureKey: signature,
        message: message || "",
      },
    });

    return res.status(201).json({
      privateKey,
      publicKey,
      signature,
      message: message || "",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllWallets = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token not found" });

    const user = jwt.verify(token, SECRET) as UserPayload;
    if (!user) return res.status(403).json({ message: "Unauthorized" });

    const wallets = await prisma.wallet.findMany({
      where: { userId: user.userId },
      include: { signature: true },
    });

    return res.status(200).json({
      message: "Wallets fetched successfully",
      success: true,
      data: wallets.map((w) => ({
        id: w.id,
        publicKey: w.publicKey,
        secretKey: w.privateKey,
        secretPhrase: w.signature.map((s) => s.signatureKey).join(", "),
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const deleteWallet = async (req: Request, res: Response) => {
  try {
    const { walletId } = req.params;
    if (!walletId) return res.status(400).json({ message: "Wallet ID is required" });

    const existingWallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!existingWallet) return res.status(404).json({ message: "Wallet not found" });

    await prisma.signature.deleteMany({ where: { walletId } });
    const deletedWallet = await prisma.wallet.delete({ where: { id: walletId } });

    return res.status(200).json({ message: "Wallet deleted successfully", data: deletedWallet });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSignature = async (req: Request, res: Response) => {
  try {
    const { signatureId } = req.params;
    if (!signatureId) return res.status(400).json({ message: "Signature ID is required" });

    const existingSignature = await prisma.signature.findUnique({ where: { id: signatureId } });
    if (!existingSignature) return res.status(404).json({ message: "Signature not found" });

    await prisma.signature.delete({ where: { id: signatureId } });

    return res.status(200).json({ message: "Signature deleted successfully", data: existingSignature });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllSignaturesOfUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token not found" });

    const user = jwt.verify(token, SECRET) as UserPayload;
    if (!user) return res.status(403).json({ message: "Unauthorized" });

    const signatures = await prisma.signature.findMany({
      where: { wallet: { userId: user.userId } },
    });

    return res.status(200).json({ message: "Signatures fetched successfully", data: signatures, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
