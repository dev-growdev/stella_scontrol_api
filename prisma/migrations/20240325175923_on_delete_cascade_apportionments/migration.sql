-- DropForeignKey
ALTER TABLE "s_control"."sc_apportionments" DROP CONSTRAINT "sc_apportionments_payment_requests_general_uid_fkey";

-- AddForeignKey
ALTER TABLE "s_control"."sc_apportionments" ADD CONSTRAINT "sc_apportionments_payment_requests_general_uid_fkey" FOREIGN KEY ("payment_requests_general_uid") REFERENCES "s_control"."sc_payment_requests_general"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
