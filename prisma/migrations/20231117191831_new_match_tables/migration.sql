/*
  Warnings:

  - You are about to alter the column `lat` on the `support_requests` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.
  - You are about to alter the column `lng` on the `support_requests` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,4)`.

*/
-- CreateEnum
CREATE TYPE "match"."match_type" AS ENUM ('MSR', 'VOLUNTEER', 'MANUAL');

-- CreateEnum
CREATE TYPE "match"."match_stage" AS ENUM ('IDEAL', 'EXPANDED', 'ONLINE');

-- CreateEnum
CREATE TYPE "match"."match_status" AS ENUM ('WAITING_CONTACT', 'IN_CONTACT', 'ENDED');

-- CreateEnum
CREATE TYPE "match"."ending_reason" AS ENUM ('MSR_NO_CONTACT');

-- AlterTable
ALTER TABLE "match"."support_requests" ALTER COLUMN "msr_id" SET DATA TYPE BIGINT,
ALTER COLUMN "zendesk_ticket_id" SET DATA TYPE BIGINT,
ALTER COLUMN "support_expertise" DROP NOT NULL,
ALTER COLUMN "priority" DROP NOT NULL,
ALTER COLUMN "has_disability" DROP NOT NULL,
ALTER COLUMN "requires_libras" DROP NOT NULL,
ALTER COLUMN "lat" DROP NOT NULL,
ALTER COLUMN "lat" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "lng" DROP NOT NULL,
ALTER COLUMN "lng" SET DATA TYPE DECIMAL(10,4),
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "match"."support_request_status_history" (
    "support_request_status_history_id" SERIAL NOT NULL,
    "support_request_id" INTEGER NOT NULL,
    "status" "match"."support_requests_status" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_request_status_history_pkey" PRIMARY KEY ("support_request_status_history_id")
);

-- CreateTable
CREATE TABLE "match"."matches" (
    "match_id" SERIAL NOT NULL,
    "support_request_id" INTEGER NOT NULL,
    "msr_id" BIGINT NOT NULL,
    "volunteer_id" INTEGER NOT NULL,
    "msr_zendesk_ticket_id" BIGINT NOT NULL,
    "volunteer_zendesk_ticket_id" BIGINT NOT NULL,
    "support_type" "match"."support_type" NOT NULL,
    "match_type" "match"."match_type" NOT NULL,
    "match_stage" "match"."match_stage" NOT NULL,
    "status" "match"."match_status" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "match"."ended_matches" (
    "match_id" INTEGER NOT NULL,
    "ending_reason" "match"."ending_reason" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ended_matches_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "match"."match_status_history" (
    "match_status_history_id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "status" "match"."match_status" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_status_history_pkey" PRIMARY KEY ("match_status_history_id")
);

-- AddForeignKey
ALTER TABLE "match"."support_request_status_history" ADD CONSTRAINT "support_request_status_history_support_request_id_fkey" FOREIGN KEY ("support_request_id") REFERENCES "match"."support_requests"("support_request_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match"."matches" ADD CONSTRAINT "matches_support_request_id_fkey" FOREIGN KEY ("support_request_id") REFERENCES "match"."support_requests"("support_request_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match"."matches" ADD CONSTRAINT "matches_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "public"."volunteers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match"."ended_matches" ADD CONSTRAINT "ended_matches_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "match"."matches"("match_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match"."match_status_history" ADD CONSTRAINT "match_status_history_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "match"."matches"("match_id") ON DELETE RESTRICT ON UPDATE CASCADE;
