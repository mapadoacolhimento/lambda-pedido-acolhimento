/*
  Warnings:

  - You are about to drop the column `volunteer_status` on the `volunteer_status_history` table. All the data in the column will be lost.
  - You are about to drop the column `aviability` on the `volunteers` table. All the data in the column will be lost.
  - You are about to drop the column `logintude` on the `volunteers` table. All the data in the column will be lost.
  - You are about to drop the column `ocuppation` on the `volunteers` table. All the data in the column will be lost.
  - Added the required column `offers_libras_support` to the `volunteer_availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `volunteer_status_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availability` to the `volunteers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupation` to the `volunteers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offers_libras_support` to the `volunteers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."volunteer_availability" ADD COLUMN     "offers_libras_support" BOOLEAN NOT NULL,
ALTER COLUMN "state" SET DATA TYPE VARCHAR(9);

-- AlterTable
ALTER TABLE "public"."volunteer_status_history" DROP COLUMN "volunteer_status",
ADD COLUMN     "status" VARCHAR(30) NOT NULL;

-- AlterTable
CREATE SEQUENCE "public".volunteers_id_seq;
ALTER TABLE "public"."volunteers" DROP COLUMN "aviability",
DROP COLUMN "logintude",
DROP COLUMN "ocuppation",
ADD COLUMN     "availability" INTEGER NOT NULL,
ADD COLUMN     "form_entries_id" BIGINT,
ADD COLUMN     "longitude" DECIMAL(10,4),
ADD COLUMN     "occupation" VARCHAR(12) NOT NULL,
ADD COLUMN     "offers_libras_support" BOOLEAN NOT NULL,
ADD COLUMN     "zendesk_user_id" BIGINT,
ALTER COLUMN "id" SET DEFAULT nextval('"public".volunteers_id_seq'),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "whatsapp" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "state" SET DATA TYPE VARCHAR(9),
ALTER COLUMN "register_number" SET DATA TYPE VARCHAR(400);
ALTER SEQUENCE "public".volunteers_id_seq OWNED BY "public"."volunteers"."id";
