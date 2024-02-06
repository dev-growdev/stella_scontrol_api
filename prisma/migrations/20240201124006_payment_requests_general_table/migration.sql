/*
  Warnings:

  - You are about to drop the `data_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_roleUid_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_userUid_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_dataProfileUid_fkey";

-- DropTable
DROP TABLE "data_profiles";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "user_roles";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "payment_requests_general" (
    "uid" TEXT NOT NULL,
    "description" TEXT,
    "required_receipt" BOOLEAN NOT NULL DEFAULT false,
    "total_request_value" DOUBLE PRECISION NOT NULL,
    "duo_date" TIMESTAMP(3) NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_requests_general_pkey" PRIMARY KEY ("uid")
);
