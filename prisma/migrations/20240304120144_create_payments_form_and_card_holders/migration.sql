-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('CREDIT', 'CORPORATE');

-- CreateTable
CREATE TABLE "payments_form" (
    "uid" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_form_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "card_holders" (
    "uid" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "type" "CardType" NOT NULL,

    CONSTRAINT "card_holders_pkey" PRIMARY KEY ("uid")
);
