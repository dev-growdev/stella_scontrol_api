/*
  Warnings:

  - You are about to alter the column `value` on the `sc_apportionments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `total_request_value` on the `sc_payments_schedule` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - Added the required column `payments_form_uid` to the `sc_payment_requests_general` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "s_control"."sc_apportionments" ALTER COLUMN "value" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "s_control"."sc_payment_requests_general" ADD COLUMN     "payments_form_uid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "s_control"."sc_payments_schedule" ALTER COLUMN "total_request_value" SET DATA TYPE DECIMAL(10,2);

-- AddForeignKey
ALTER TABLE "s_control"."sc_payment_requests_general" ADD CONSTRAINT "sc_payment_requests_general_payments_form_uid_fkey" FOREIGN KEY ("payments_form_uid") REFERENCES "s_control"."sc_payments_form"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
