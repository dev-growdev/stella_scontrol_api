/*
  Warnings:

  - You are about to drop the column `duo_date` on the `payment_requests_general` table. All the data in the column will be lost.
  - Added the required column `due_date` to the `payment_requests_general` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment_requests_general" DROP COLUMN "duo_date",
ADD COLUMN     "due_date" TIMESTAMP(3) NOT NULL;
