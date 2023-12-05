/*
  Warnings:

  - The values [ended] on the enum `match_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "match"."match_status_new" AS ENUM ('completed', 'expired', 'in_contact', 'interrupted_after_support', 'interrupted_before_support', 'waiting_contact');
ALTER TABLE "match"."matches" ALTER COLUMN "status" TYPE "match"."match_status_new" USING ("status"::text::"match"."match_status_new");
ALTER TABLE "match"."match_status_history" ALTER COLUMN "status" TYPE "match"."match_status_new" USING ("status"::text::"match"."match_status_new");
ALTER TYPE "match"."match_status" RENAME TO "match_status_old";
ALTER TYPE "match"."match_status_new" RENAME TO "match_status";
DROP TYPE "match"."match_status_old";
COMMIT;
