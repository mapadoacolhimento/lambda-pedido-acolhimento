-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "match";

-- CreateEnum
CREATE TYPE "match"."support_type" AS ENUM ('PSYCOLOGICAL', 'LEGAL');

-- CreateEnum
CREATE TYPE "match"."support_requests_status" AS ENUM ('OPEN', 'MATCHED', 'SOCIAL_ASSISTANT', 'PUBLIC_SERVICE', 'FINISHED');

-- CreateTable
CREATE TABLE "match"."support_requests" (
    "support_request_id" SERIAL NOT NULL,
    "msr_id" INTEGER NOT NULL,
    "zendesk_ticket_id" INTEGER NOT NULL,
    "support_type" "match"."support_type" NOT NULL,
    "support_expertise" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "has_disability" BOOLEAN NOT NULL,
    "requires_libras" BOOLEAN NOT NULL,
    "accepts_online_support" BOOLEAN NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "status" "match"."support_requests_status" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_requests_pkey" PRIMARY KEY ("support_request_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "support_requests_zendesk_ticket_id_key" ON "match"."support_requests"("zendesk_ticket_id");
