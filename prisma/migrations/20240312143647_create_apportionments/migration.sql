-- CreateTable
CREATE TABLE "apportionments" (
    "uid" TEXT NOT NULL,
    "paymentRequestsGeneralUid" TEXT NOT NULL,
    "cost_center" TEXT NOT NULL,
    "accounting_account" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apportionments_pkey" PRIMARY KEY ("uid")
);

-- AddForeignKey
ALTER TABLE "apportionments" ADD CONSTRAINT "apportionments_paymentRequestsGeneralUid_fkey" FOREIGN KEY ("paymentRequestsGeneralUid") REFERENCES "payment_requests_general"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
