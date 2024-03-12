/*
  Warnings:

  - Added the required column `accounting_account` to the `payment_requests_general` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_value` to the `payment_requests_general` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment_requests_general" ADD COLUMN     "accounting_account" VARCHAR(255) NOT NULL,
ADD COLUMN     "total_value" DOUBLE PRECISION NOT NULL;
