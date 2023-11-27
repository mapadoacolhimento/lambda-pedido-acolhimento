-- AlterTable
ALTER TABLE "public"."volunteers" ADD COLUMN     "moodle_id" INTEGER;

-- CreateTable
CREATE TABLE "public"."msrs_place" (
    "id" BIGSERIAL NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(2),

    CONSTRAINT "msrs_place_pkey" PRIMARY KEY ("id")
);
