/*
  Warnings:

  - You are about to drop the `SupportRequests` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "support_type" AS ENUM ('PSYCOLOGICAL', 'LEGAL');

-- CreateEnum
CREATE TYPE "support_requests_status" AS ENUM ('OPEN', 'MATCHED', 'SOCIAL_ASSISTANT', 'PUBLIC_SERVICE', 'FINISHED');

-- DropTable
DROP TABLE "SupportRequests";

-- DropEnum
DROP TYPE "SupportRequestsStatus";

-- DropEnum
DROP TYPE "SupportType";

-- CreateTable
CREATE TABLE "support_requests" (
    "support_request_id" SERIAL NOT NULL,
    "msr_id" INTEGER NOT NULL,
    "zendesk_ticket_id" INTEGER NOT NULL,
    "support_type" "support_type" NOT NULL,
    "support_expertise" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "has_disability" BOOLEAN NOT NULL,
    "requires_libras" BOOLEAN NOT NULL,
    "accepts_online_support" BOOLEAN NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "status" "support_requests_status" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_requests_pkey" PRIMARY KEY ("support_request_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "support_requests_zendesk_ticket_id_key" ON "support_requests"("zendesk_ticket_id");
