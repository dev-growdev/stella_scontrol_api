-- CreateTable
CREATE TABLE "s_quality"."sq_suppliers" (
    "uid" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "continent" VARCHAR(30) NOT NULL,
    "phone_number" VARCHAR(30),
    "address" VARCHAR(100),
    "city" VARCHAR(100),
    "region" VARCHAR(100),
    "country" VARCHAR(100),
    "contact_name" VARCHAR,
    "enable" BOOLEAN NOT NULL,
    "is_excluded" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "excluded_at" TIMESTAMP(3),

    CONSTRAINT "sq_suppliers_pkey" PRIMARY KEY ("uid")
);
