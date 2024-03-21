-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "s_auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "s_control";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "s_quality";

-- CreateEnum
CREATE TYPE "s_control"."ScCardType" AS ENUM ('credit', 'corporate');

-- CreateTable
CREATE TABLE "s_auth"."sa_user" (
    "uid" TEXT NOT NULL,
    "id_user_ad" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sa_user_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "s_control"."sc_payment_requests_general" (
    "uid" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "description" TEXT,
    "send_receipt" BOOLEAN NOT NULL DEFAULT false,
    "total_value" DECIMAL(65,30) NOT NULL,
    "accounting_account" VARCHAR(255),
    "user_created_uid" TEXT NOT NULL,
    "card_holders_uid" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sc_payment_requests_general_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "s_control"."sc_payments_schedule" (
    "uid" TEXT NOT NULL,
    "paymentRequestsGeneralUid" TEXT NOT NULL,
    "total_request_value" DOUBLE PRECISION NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sc_payments_schedule_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "s_control"."sc_categories" (
    "uid" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sc_categories_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "s_control"."sc_products" (
    "uid" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "code" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "measurement" VARCHAR(50),
    "quantity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sc_products_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "s_control"."sc_temp_suppliers_data" (
    "uid" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "cnpj" VARCHAR(20) NOT NULL,
    "source" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sc_temp_suppliers_data_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "s_control"."sc_files" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sc_files_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "s_control"."sc_payment_requests_files" (
    "uid" TEXT NOT NULL,
    "file_uid" TEXT NOT NULL,
    "payment_request_uid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sc_payment_requests_files_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "s_control"."sc_payments_form" (
    "uid" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sc_payments_form_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "s_control"."sc_card_holders" (
    "uid" TEXT NOT NULL,
    "payment_form_id" TEXT,
    "code" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "type" "s_control"."ScCardType" NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sc_card_holders_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "s_control"."sc_apportionments" (
    "uid" TEXT NOT NULL,
    "payment_requests_general_uid" TEXT NOT NULL,
    "cost_center" TEXT NOT NULL,
    "accounting_account" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sc_apportionments_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "sa_user_id_user_ad_key" ON "s_auth"."sa_user"("id_user_ad");

-- CreateIndex
CREATE UNIQUE INDEX "sa_user_email_key" ON "s_auth"."sa_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sc_temp_suppliers_data_cnpj_key" ON "s_control"."sc_temp_suppliers_data"("cnpj");

-- AddForeignKey
ALTER TABLE "s_control"."sc_payment_requests_general" ADD CONSTRAINT "sc_payment_requests_general_user_created_uid_fkey" FOREIGN KEY ("user_created_uid") REFERENCES "s_auth"."sa_user"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "s_control"."sc_payment_requests_general" ADD CONSTRAINT "sc_payment_requests_general_card_holders_uid_fkey" FOREIGN KEY ("card_holders_uid") REFERENCES "s_control"."sc_card_holders"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "s_control"."sc_payments_schedule" ADD CONSTRAINT "sc_payments_schedule_paymentRequestsGeneralUid_fkey" FOREIGN KEY ("paymentRequestsGeneralUid") REFERENCES "s_control"."sc_payment_requests_general"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "s_control"."sc_products" ADD CONSTRAINT "sc_products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "s_control"."sc_categories"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "s_control"."sc_payment_requests_files" ADD CONSTRAINT "sc_payment_requests_files_file_uid_fkey" FOREIGN KEY ("file_uid") REFERENCES "s_control"."sc_files"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "s_control"."sc_payment_requests_files" ADD CONSTRAINT "sc_payment_requests_files_payment_request_uid_fkey" FOREIGN KEY ("payment_request_uid") REFERENCES "s_control"."sc_payment_requests_general"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "s_control"."sc_card_holders" ADD CONSTRAINT "sc_card_holders_payment_form_id_fkey" FOREIGN KEY ("payment_form_id") REFERENCES "s_control"."sc_payments_form"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "s_control"."sc_apportionments" ADD CONSTRAINT "sc_apportionments_payment_requests_general_uid_fkey" FOREIGN KEY ("payment_requests_general_uid") REFERENCES "s_control"."sc_payment_requests_general"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
