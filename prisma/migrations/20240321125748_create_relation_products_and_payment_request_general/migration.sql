-- AlterTable
ALTER TABLE "payment_requests_general" ADD COLUMN     "unregistered_products" TEXT[];

-- CreateTable
CREATE TABLE "_PaymentRequestsGeneralToProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PaymentRequestsGeneralToProducts_AB_unique" ON "_PaymentRequestsGeneralToProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_PaymentRequestsGeneralToProducts_B_index" ON "_PaymentRequestsGeneralToProducts"("B");

-- AddForeignKey
ALTER TABLE "_PaymentRequestsGeneralToProducts" ADD CONSTRAINT "_PaymentRequestsGeneralToProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "payment_requests_general"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentRequestsGeneralToProducts" ADD CONSTRAINT "_PaymentRequestsGeneralToProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
