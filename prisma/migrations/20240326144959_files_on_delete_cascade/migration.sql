-- DropForeignKey
ALTER TABLE "s_control"."sc_payment_requests_files" DROP CONSTRAINT "sc_payment_requests_files_file_uid_fkey";

-- DropForeignKey
ALTER TABLE "s_control"."sc_payment_requests_files" DROP CONSTRAINT "sc_payment_requests_files_payment_request_uid_fkey";

-- AddForeignKey
ALTER TABLE "s_control"."sc_payment_requests_files" ADD CONSTRAINT "sc_payment_requests_files_file_uid_fkey" FOREIGN KEY ("file_uid") REFERENCES "s_control"."sc_files"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "s_control"."sc_payment_requests_files" ADD CONSTRAINT "sc_payment_requests_files_payment_request_uid_fkey" FOREIGN KEY ("payment_request_uid") REFERENCES "s_control"."sc_payment_requests_general"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
