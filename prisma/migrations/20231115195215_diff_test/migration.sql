/*
  Warnings:

  - You are about to drop the `volunteers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "register";

-- DropForeignKey
ALTER TABLE "public"."volunteers" DROP CONSTRAINT "volunteers_volunteer_form_data_id_ec6c5a18_fk_volunteer";

-- DropTable
DROP TABLE "public"."volunteers";

-- CreateTable
CREATE TABLE "register"."volunteers" (
    "id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "condition" VARCHAR(30) NOT NULL,
    "first_name" VARCHAR(200) NOT NULL,
    "last_name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "whatsapp" VARCHAR(11) NOT NULL,
    "zipcode" VARCHAR(9) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "neighborhood" VARCHAR(100) NOT NULL,
    "latitude" DECIMAL(10,4),
    "logintude" DECIMAL(10,4),
    "register_number" VARCHAR(11) NOT NULL,
    "birth_date" TIMESTAMPTZ(6) NOT NULL,
    "color" VARCHAR(100) NOT NULL,
    "gender" VARCHAR(100) NOT NULL,
    "modality" VARCHAR(100) NOT NULL,
    "fields_of_work" VARCHAR(200) NOT NULL,
    "years_of_experience" VARCHAR(100) NOT NULL,
    "aviability" VARCHAR(100) NOT NULL,
    "approach" VARCHAR(100),
    "form_data_id" BIGINT,
    "ocuppation" VARCHAR(10) NOT NULL,

    CONSTRAINT "volunteers_volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "volunteers_volunteer_form_data_id_ec6c5a18" ON "register"."volunteers"("form_data_id");

-- AddForeignKey
ALTER TABLE "register"."volunteers" ADD CONSTRAINT "volunteers_volunteer_form_data_id_ec6c5a18_fk_volunteer" FOREIGN KEY ("form_data_id") REFERENCES "public"."volunteers_formdata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
