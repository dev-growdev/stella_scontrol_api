/*
  Warnings:

  - Added the required column `code` to the `card_holders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "card_holders" ADD COLUMN     "code" INTEGER NOT NULL;
