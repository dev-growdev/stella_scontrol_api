/*
  Warnings:

  - You are about to drop the column `paymentsFormUid` on the `payment_requests_general` table. All the data in the column will be lost.
  - Added the required column `payments_form_uid` to the `payment_requests_general` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payment_requests_general" DROP CONSTRAINT "payment_requests_general_paymentsFormUid_fkey";

-- AlterTable
ALTER TABLE "payment_requests_general" DROP COLUMN "paymentsFormUid",
ADD COLUMN     "payments_form_uid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "payment_requests_general" ADD CONSTRAINT "payment_requests_general_payments_form_uid_fkey" FOREIGN KEY ("payments_form_uid") REFERENCES "payments_form"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
