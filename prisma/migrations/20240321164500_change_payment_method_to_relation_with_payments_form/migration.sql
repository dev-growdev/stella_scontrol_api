/*
  Warnings:

  - You are about to drop the column `payment_method` on the `payment_requests_general` table. All the data in the column will be lost.
  - Added the required column `paymentsFormUid` to the `payment_requests_general` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment_requests_general" DROP COLUMN "payment_method",
ADD COLUMN     "paymentsFormUid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "payment_requests_general" ADD CONSTRAINT "payment_requests_general_paymentsFormUid_fkey" FOREIGN KEY ("paymentsFormUid") REFERENCES "payments_form"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
