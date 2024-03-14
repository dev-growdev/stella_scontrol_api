/*
  Warnings:

  - Added the required column `user_created_uid` to the `payment_requests_general` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment_requests_general" ADD COLUMN     "user_created_uid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "payment_requests_general" ADD CONSTRAINT "payment_requests_general_user_created_uid_fkey" FOREIGN KEY ("user_created_uid") REFERENCES "user"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
