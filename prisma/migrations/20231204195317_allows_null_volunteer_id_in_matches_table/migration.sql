-- DropForeignKey
ALTER TABLE "match"."matches" DROP CONSTRAINT "matches_volunteer_id_fkey";

-- AlterTable
ALTER TABLE "match"."matches" ALTER COLUMN "volunteer_id" DROP NOT NULL,
ALTER COLUMN "volunteer_zendesk_ticket_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "match"."matches" ADD CONSTRAINT "matches_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "public"."volunteers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
