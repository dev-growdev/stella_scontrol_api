/*
  Warnings:

  - You are about to drop the column `paymentRequestsGeneralUid` on the `apportionments` table. All the data in the column will be lost.
  - Added the required column `payment_requests_general_uid` to the `apportionments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "apportionments" DROP CONSTRAINT "apportionments_paymentRequestsGeneralUid_fkey";

-- AlterTable
ALTER TABLE "apportionments" DROP COLUMN "paymentRequestsGeneralUid",
ADD COLUMN     "payment_requests_general_uid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payment_requests_general" ADD COLUMN     "cardHoldersUid" TEXT;

-- AddForeignKey
ALTER TABLE "payment_requests_general" ADD CONSTRAINT "payment_requests_general_cardHoldersUid_fkey" FOREIGN KEY ("cardHoldersUid") REFERENCES "card_holders"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apportionments" ADD CONSTRAINT "apportionments_payment_requests_general_uid_fkey" FOREIGN KEY ("payment_requests_general_uid") REFERENCES "payment_requests_general"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
