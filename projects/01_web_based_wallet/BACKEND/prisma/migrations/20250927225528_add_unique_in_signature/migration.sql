/*
  Warnings:

  - A unique constraint covering the columns `[walletId]` on the table `Signature` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Signature_walletId_key" ON "public"."Signature"("walletId");
