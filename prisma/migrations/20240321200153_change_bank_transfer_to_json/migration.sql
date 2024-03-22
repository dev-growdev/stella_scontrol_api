/*
  Warnings:

  - The `bank_transfer` column on the `payment_requests_general` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "payment_requests_general" DROP COLUMN "bank_transfer",
ADD COLUMN     "bank_transfer" JSONB;
