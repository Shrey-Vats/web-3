import type { Request, Response } from "express";
import { generateUsername } from "unique-username-generator";
import prisma from "../utils/db.js";
import { ethers } from "ethers";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { stringify } from "querystring";

interface userPayload extends JwtPayload {
  id: string;
  name: string;
}

export const createRandomUser = async (req: Request, res: Response) => {
  try {
    const name = generateUsername();

    const user = await prisma.user.create({
      data: {
        name,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
      },
      process.env.SECRET || "shrey"
    );

    res.setHeader("Authorization", `Bearer ${token}`);

    res.status(200).json({
      message: "User created successfully",
      name,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error on creating user",
    });
  }
};

export const createWallet = async (req: Request, res: Response) => {
  try {
    const { message } = req.body || {};
    const authHeader = req.headers["authorization"];
    const secret = process.env.SECRET || "shrey";

    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(404).json({ message: "token not found" });

    const user = jwt.verify(token, secret) as JwtPayload;
    if (!user) return res.status(400).json({ message: "Unauthorize" });

    const wallet = ethers.Wallet.createRandom();
    const publicKey = wallet.address;
    const privateKey = wallet.privateKey;

    const signature = await wallet.signMessage(
      message !== undefined ? message : ""
    );

    const wallets = await prisma.wallet.create({
      data: {
        privateKey,
        publicKey,
        userId: (user as userPayload).userId,
      },
    });

    const data: {
      walletId: string;
      signatureKey: string;
      message?: string;
    } = {
      walletId: wallets.id,
      signatureKey: signature,
    };

    if (message) data["message"] = message;

    await prisma.signature.create({
      data,
    });

    res.status(200).json({
      privateKey,
      publicKey,
      signature,
      message: message || "",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllWallets = async (req: Request, res: Response) => {
  try {
    const wallets = await prisma.wallet.findMany({
      include: {
        signature: {
          select: {
            signatureKey: true,
            message: true,
          },
        },
      },
    });
    res.status(200).json({ message: "successfuly send", data: wallets });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteWallet = async (req: Request, res: Response) => {
  try {
    const { walletId } = req.params;

    if (!walletId)
      return res.status(400).json({ message: "wallet id is required" });

    const existingWallet = await prisma.wallet.findUnique({
      where: {
        id: walletId,
      },
    });
    if (!existingWallet)
      return res.status(404).json({ message: "wallet not found" });

    await prisma.signature.deleteMany({
      where: {
        walletId: walletId,
      },
    });

    const wallet = await prisma.wallet.delete({
      where: {
        id: walletId,
      },
    });

    res
      .status(200)
      .json({ message: "wallet deleted successfuly", data: wallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteSignature = async (req: Request, res: Response) => {
  try {
    const { signatureId } = req.params;

    if (!signatureId)
      return res.status(400).json({ message: "signature id is required" });

    const existingSignature = await prisma.signature.findUnique({
      where: {
        id: signatureId,
      },
    });
    if (!existingSignature)
      return res.status(404).json({ message: "signature not found" });

    await prisma.signature.delete({
      where: {
        id: signatureId,
      },
    });

    res
      .status(200)
      .json({ message: "signature deleted successfuly", data: existingSignature });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
