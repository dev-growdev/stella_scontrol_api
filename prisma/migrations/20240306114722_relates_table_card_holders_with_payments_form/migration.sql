-- AlterTable
ALTER TABLE "card_holders" ADD COLUMN     "paymentFormId" TEXT;

-- AddForeignKey
ALTER TABLE "card_holders" ADD CONSTRAINT "card_holders_paymentFormId_fkey" FOREIGN KEY ("paymentFormId") REFERENCES "payments_form"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
