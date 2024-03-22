-- AlterTable
ALTER TABLE "s_control"."sc_payment_requests_general" ADD COLUMN     "bank_transfer" JSON,
ADD COLUMN     "is_rateable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pix" TEXT,
ADD COLUMN     "unregistered_products" TEXT[];

-- CreateTable
CREATE TABLE "s_control"."_ScPaymentRequestsGeneralToScProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ScPaymentRequestsGeneralToScProducts_AB_unique" ON "s_control"."_ScPaymentRequestsGeneralToScProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_ScPaymentRequestsGeneralToScProducts_B_index" ON "s_control"."_ScPaymentRequestsGeneralToScProducts"("B");

-- AddForeignKey
ALTER TABLE "s_control"."_ScPaymentRequestsGeneralToScProducts" ADD CONSTRAINT "_ScPaymentRequestsGeneralToScProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "s_control"."sc_payment_requests_general"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "s_control"."_ScPaymentRequestsGeneralToScProducts" ADD CONSTRAINT "_ScPaymentRequestsGeneralToScProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "s_control"."sc_products"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
