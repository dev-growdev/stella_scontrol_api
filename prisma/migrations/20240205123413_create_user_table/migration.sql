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
CREATE TABLE "user" (
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
