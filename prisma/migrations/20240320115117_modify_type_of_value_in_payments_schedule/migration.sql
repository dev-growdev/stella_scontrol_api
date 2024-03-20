/*
  Warnings:

  - You are about to alter the column `value` on the `apportionments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `total_request_value` on the `payments_schedule` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "apportionments" ALTER COLUMN "value" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "payments_schedule" ALTER COLUMN "total_request_value" SET DATA TYPE DECIMAL(10,2);
