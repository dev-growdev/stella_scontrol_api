/*
  Warnings:

  - You are about to alter the column `total_value` on the `payment_requests_general` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "payment_requests_general" ALTER COLUMN "total_value" SET DATA TYPE DECIMAL(65,30);
