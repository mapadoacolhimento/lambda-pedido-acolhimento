/*
  Warnings:

  - You are about to alter the column `support_expertise` on the `volunteer_availability` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(100)`.
  - You are about to drop the `core_formdata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_integrationlogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `msrs_place` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `solidarity_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."core_formdata" DROP CONSTRAINT "core_formdata_user_id_3a7f140c_fk_auth_user_id";

-- DropForeignKey
ALTER TABLE "public"."core_integrationlogs" DROP CONSTRAINT "core_integrationlogs_form_data_id_3bdb0c69_fk_core_formdata_id";

-- DropTable
DROP TABLE "public"."core_formdata";

-- DropTable
DROP TABLE "public"."core_integrationlogs";

-- DropTable
DROP TABLE "public"."msrs_place";

-- DropTable
DROP TABLE "public"."solidarity_users";
