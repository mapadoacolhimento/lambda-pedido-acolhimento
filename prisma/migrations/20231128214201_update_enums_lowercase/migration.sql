/*
  Warnings:

  - The values [MSR_NO_CONTACT] on the enum `ending_reason` will be removed. If these variants are still used in the database, this will fail.
  - The values [IDEAL,EXPANDED,ONLINE] on the enum `match_stage` will be removed. If these variants are still used in the database, this will fail.
  - The values [WAITING_CONTACT,IN_CONTACT,ENDED] on the enum `match_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [MSR,VOLUNTEER,MANUAL] on the enum `match_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [OPEN,MATCHED,SOCIAL_ASSISTANT,PUBLIC_SERVICE,FINISHED] on the enum `support_requests_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [PSYCOLOGICAL,LEGAL] on the enum `support_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "match"."ending_reason_new" AS ENUM ('msr_no_contact');
ALTER TABLE "match"."ended_matches" ALTER COLUMN "ending_reason" TYPE "match"."ending_reason_new" USING ("ending_reason"::text::"match"."ending_reason_new");
ALTER TYPE "match"."ending_reason" RENAME TO "ending_reason_old";
ALTER TYPE "match"."ending_reason_new" RENAME TO "ending_reason";
DROP TYPE "match"."ending_reason_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "match"."match_stage_new" AS ENUM ('ideal', 'expanded', 'online');
ALTER TABLE "match"."matches" ALTER COLUMN "match_stage" TYPE "match"."match_stage_new" USING ("match_stage"::text::"match"."match_stage_new");
ALTER TYPE "match"."match_stage" RENAME TO "match_stage_old";
ALTER TYPE "match"."match_stage_new" RENAME TO "match_stage";
DROP TYPE "match"."match_stage_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "match"."match_status_new" AS ENUM ('waiting_contact', 'in_contact', 'ended');
ALTER TABLE "match"."matches" ALTER COLUMN "status" TYPE "match"."match_status_new" USING ("status"::text::"match"."match_status_new");
ALTER TABLE "match"."match_status_history" ALTER COLUMN "status" TYPE "match"."match_status_new" USING ("status"::text::"match"."match_status_new");
ALTER TYPE "match"."match_status" RENAME TO "match_status_old";
ALTER TYPE "match"."match_status_new" RENAME TO "match_status";
DROP TYPE "match"."match_status_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "match"."match_type_new" AS ENUM ('msr', 'volunteer', 'manual');
ALTER TABLE "match"."matches" ALTER COLUMN "match_type" TYPE "match"."match_type_new" USING ("match_type"::text::"match"."match_type_new");
ALTER TYPE "match"."match_type" RENAME TO "match_type_old";
ALTER TYPE "match"."match_type_new" RENAME TO "match_type";
DROP TYPE "match"."match_type_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "match"."support_requests_status_new" AS ENUM ('open', 'matched', 'social_assistant', 'public_service', 'finished');
ALTER TABLE "match"."support_requests" ALTER COLUMN "status" TYPE "match"."support_requests_status_new" USING ("status"::text::"match"."support_requests_status_new");
ALTER TABLE "match"."support_request_status_history" ALTER COLUMN "status" TYPE "match"."support_requests_status_new" USING ("status"::text::"match"."support_requests_status_new");
ALTER TYPE "match"."support_requests_status" RENAME TO "support_requests_status_old";
ALTER TYPE "match"."support_requests_status_new" RENAME TO "support_requests_status";
DROP TYPE "match"."support_requests_status_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "match"."support_type_new" AS ENUM ('psychological', 'legal');
ALTER TABLE "match"."support_requests" ALTER COLUMN "support_type" TYPE "match"."support_type_new" USING ("support_type"::text::"match"."support_type_new");
ALTER TABLE "match"."matches" ALTER COLUMN "support_type" TYPE "match"."support_type_new" USING ("support_type"::text::"match"."support_type_new");
ALTER TYPE "match"."support_type" RENAME TO "support_type_old";
ALTER TYPE "match"."support_type_new" RENAME TO "support_type";
DROP TYPE "match"."support_type_old";
COMMIT;
