/*
  Warnings:

  - You are about to drop the column `due_date` on the `payment_requests_general` table. All the data in the column will be lost.
  - You are about to drop the column `total_request_value` on the `payment_requests_general` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payment_requests_general" DROP COLUMN "due_date",
DROP COLUMN "total_request_value";

-- CreateTable
CREATE TABLE "payments_schedule" (
    "uid" TEXT NOT NULL,
    "paymentRequestsGeneralUid" TEXT NOT NULL,
    "total_request_value" DOUBLE PRECISION NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_schedule_pkey" PRIMARY KEY ("uid")
);

-- AddForeignKey
ALTER TABLE "payments_schedule" ADD CONSTRAINT "payments_schedule_paymentRequestsGeneralUid_fkey" FOREIGN KEY ("paymentRequestsGeneralUid") REFERENCES "payment_requests_general"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
