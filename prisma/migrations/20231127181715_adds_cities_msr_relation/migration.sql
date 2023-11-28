/*
  Warnings:

  - You are about to drop the column `city` on the `msrs_msrs` table. All the data in the column will be lost.
  - Added the required column `city_id` to the `msrs_msrs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `volunteer_availability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."integrations_logs" ALTER COLUMN "error" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."msrs_msrs" DROP COLUMN "city",
ADD COLUMN     "city_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."volunteer_availability" ADD COLUMN     "state" VARCHAR(2) NOT NULL;

-- CreateIndex
CREATE INDEX "msrs_msrs_city_id_e49bad88" ON "public"."msrs_msrs"("city_id");

-- AddForeignKey
ALTER TABLE "public"."msrs_msrs" ADD CONSTRAINT "msrs_msrs_city_id_e49bad88_fk_cities_city_id" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("city_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
