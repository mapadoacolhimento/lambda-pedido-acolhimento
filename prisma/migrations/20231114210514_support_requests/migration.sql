-- CreateEnum
CREATE TYPE "SupportType" AS ENUM ('PSYCOLOGICAL', 'LEGAL');

-- CreateEnum
CREATE TYPE "SupportRequestsStatus" AS ENUM ('OPEN', 'MATCHED', 'SOCIAL_ASSISTANT', 'PUBLIC_SERVICE', 'FINISHED');

-- CreateTable
CREATE TABLE "SupportRequests" (
    "support_request_id" SERIAL NOT NULL,
    "msr_id" INTEGER NOT NULL,
    "zendesk_ticket_id" INTEGER NOT NULL,
    "support_type" "SupportType" NOT NULL,
    "support_expertise" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "has_disability" BOOLEAN NOT NULL,
    "requires_libras" BOOLEAN NOT NULL,
    "accepts_online_support" BOOLEAN NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "status" "SupportRequestsStatus" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportRequests_pkey" PRIMARY KEY ("support_request_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupportRequests_zendesk_ticket_id_key" ON "SupportRequests"("zendesk_ticket_id");
