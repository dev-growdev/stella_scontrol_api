/*
  Warnings:

  - Added the required column `payment_method` to the `payment_requests_general` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment_requests_general" ADD COLUMN     "payment_method" TEXT NOT NULL;
