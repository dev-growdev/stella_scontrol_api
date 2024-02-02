/*
  Warnings:

  - You are about to drop the column `required_receipt` on the `payment_requests_general` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payment_requests_general" DROP COLUMN "required_receipt",
ADD COLUMN     "send_receipt" BOOLEAN NOT NULL DEFAULT false;
