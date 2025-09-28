import e from "express";
import { createRandomUser, createWallet, deleteSignature, deleteWallet, getAllWallets } from "./controllers/wallet.controller.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = e();

app.use(e.json());
app.use(cors());

app.get("/", getAllWallets);
app.get("/user", createRandomUser);
app.post("/", createWallet);
app.delete("/:walletId", deleteWallet);
app.delete("/signature/:signatureId", deleteSignature);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});