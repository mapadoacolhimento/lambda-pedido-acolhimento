/*
  Warnings:

  - You are about to drop the `ended_matches` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "match"."ended_matches" DROP CONSTRAINT "ended_matches_match_id_fkey";

-- DropTable
DROP TABLE "match"."ended_matches";

-- DropEnum
DROP TYPE "match"."ending_reason";
