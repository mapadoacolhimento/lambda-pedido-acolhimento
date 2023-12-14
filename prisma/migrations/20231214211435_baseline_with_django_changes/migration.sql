/*
  Warnings:

  - You are about to drop the `msrs_msrs` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `state` on table `volunteers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `volunteers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `neighborhood` on table `volunteers` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."msrs_msrs" DROP CONSTRAINT "msrs_msrs_city_id_e49bad88_fk_cities_city_id";

-- AlterTable
ALTER TABLE "public"."volunteer_availability" ALTER COLUMN "support_expertise" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "public"."volunteers" ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "neighborhood" SET NOT NULL;

-- DropTable
DROP TABLE "public"."msrs_msrs";

-- CreateTable
CREATE TABLE "public"."msrs" (
    "id" BIGSERIAL NOT NULL,
    "user_zendesk_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "color" VARCHAR(15) NOT NULL,
    "gender" VARCHAR(15) NOT NULL,
    "whatsapp" VARCHAR(11) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "city_id" INTEGER NOT NULL,
    "neighborhood" VARCHAR(100) NOT NULL,
    "latitude" DECIMAL(10,4) NOT NULL,
    "logintude" DECIMAL(10,4) NOT NULL,
    "pcd" BOOLEAN NOT NULL,
    "education" VARCHAR(40) NOT NULL,
    "work_situation" VARCHAR(40) NOT NULL,
    "income" DECIMAL(10,2) NOT NULL,
    "duration_of_violence" VARCHAR(30) NOT NULL,
    "author_of_violence" VARCHAR(30) NOT NULL,
    "story" TEXT NOT NULL,
    "risk_factors" VARCHAR(140) NOT NULL,
    "protective_factors" VARCHAR(100) NOT NULL,
    "public_service" VARCHAR(100) NOT NULL,
    "type_of_support" VARCHAR(20) NOT NULL,
    "access" VARCHAR(30) NOT NULL,
    "status" VARCHAR(15) NOT NULL,
    "support_on_queue" BOOLEAN NOT NULL,
    "on_queue" BOOLEAN NOT NULL,
    "online" BOOLEAN NOT NULL,
    "priority" VARCHAR(15) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "match" BOOLEAN NOT NULL,
    "digital_violence" VARCHAR(200) NOT NULL,
    "obstetric_violence" VARCHAR(100) NOT NULL,
    "physical_violence" VARCHAR(100) NOT NULL,
    "property_violence" VARCHAR(100) NOT NULL,
    "psych_violence" VARCHAR(100) NOT NULL,
    "sexual_violence" VARCHAR(100) NOT NULL,

    CONSTRAINT "msrs_msrs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "msrs_msrs_city_id_e49bad88" ON "public"."msrs"("city_id");

-- AddForeignKey
ALTER TABLE "public"."msrs" ADD CONSTRAINT "msrs_msrs_city_id_e49bad88_fk_cities_city_id" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("city_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
