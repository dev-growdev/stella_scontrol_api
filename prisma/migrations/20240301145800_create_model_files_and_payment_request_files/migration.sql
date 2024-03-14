-- CreateTable
CREATE TABLE "files" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "payment_requests_files" (
    "uid" TEXT NOT NULL,
    "file_uid" TEXT NOT NULL,
    "payment_request_uid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_requests_files_pkey" PRIMARY KEY ("uid")
);

-- AddForeignKey
ALTER TABLE "payment_requests_files" ADD CONSTRAINT "payment_requests_files_file_uid_fkey" FOREIGN KEY ("file_uid") REFERENCES "files"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_requests_files" ADD CONSTRAINT "payment_requests_files_payment_request_uid_fkey" FOREIGN KEY ("payment_request_uid") REFERENCES "payment_requests_general"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
