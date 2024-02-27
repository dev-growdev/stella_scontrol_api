-- CreateTable
CREATE TABLE "payment_requests_general" (
    "uid" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "description" TEXT,
    "send_receipt" BOOLEAN NOT NULL DEFAULT false,
    "total_request_value" DOUBLE PRECISION NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_requests_general_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "user" (
    "uid" TEXT NOT NULL,
    "id_user_ad" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "categories" (
    "uid" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "products" (
    "uid" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "measurement" VARCHAR(50),
    "quantity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "temp_suppliers_data" (
    "uid" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "cnpj" VARCHAR(20) NOT NULL,
    "source" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "temp_suppliers_data_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_user_ad_key" ON "user"("id_user_ad");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "temp_suppliers_data_cnpj_key" ON "temp_suppliers_data"("cnpj");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
