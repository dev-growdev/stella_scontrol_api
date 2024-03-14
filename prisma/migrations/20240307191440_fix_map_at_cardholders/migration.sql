/*
  Warnings:

  - You are about to drop the column `paymentFormId` on the `card_holders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "card_holders" DROP CONSTRAINT "card_holders_paymentFormId_fkey";

-- AlterTable
ALTER TABLE "card_holders" DROP COLUMN "paymentFormId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "payment_form_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "card_holders" ADD CONSTRAINT "card_holders_payment_form_id_fkey" FOREIGN KEY ("payment_form_id") REFERENCES "payments_form"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
