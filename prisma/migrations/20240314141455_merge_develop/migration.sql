-- AlterTable
ALTER TABLE "payment_requests_general" ADD COLUMN     "card_holders_uid" TEXT;

-- AddForeignKey
ALTER TABLE "payment_requests_general" ADD CONSTRAINT "payment_requests_general_card_holders_uid_fkey" FOREIGN KEY ("card_holders_uid") REFERENCES "card_holders"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
