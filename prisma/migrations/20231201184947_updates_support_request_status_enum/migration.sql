/*
  Warnings:

  - The values [completed,old] on the enum `support_requests_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "match"."support_requests_status_new" AS ENUM ('open', 'matched', 'social_assistant', 'public_service', 'duplicated', 'closed');
ALTER TABLE "match"."support_requests" ALTER COLUMN "status" TYPE "match"."support_requests_status_new" USING ("status"::text::"match"."support_requests_status_new");
ALTER TABLE "match"."support_request_status_history" ALTER COLUMN "status" TYPE "match"."support_requests_status_new" USING ("status"::text::"match"."support_requests_status_new");
ALTER TYPE "match"."support_requests_status" RENAME TO "support_requests_status_old";
ALTER TYPE "match"."support_requests_status_new" RENAME TO "support_requests_status";
DROP TYPE "match"."support_requests_status_old";
COMMIT;
