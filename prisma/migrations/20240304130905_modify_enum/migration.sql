/*
  Warnings:

  - The values [CREDIT,CORPORATE] on the enum `CardType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CardType_new" AS ENUM ('credit', 'corporate');
ALTER TABLE "card_holders" ALTER COLUMN "type" TYPE "CardType_new" USING ("type"::text::"CardType_new");
ALTER TYPE "CardType" RENAME TO "CardType_old";
ALTER TYPE "CardType_new" RENAME TO "CardType";
DROP TYPE "CardType_old";
COMMIT;
