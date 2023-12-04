/*
  Warnings:

  - You are about to drop the column `surveyType` on the `match_surveys` table. All the data in the column will be lost.
  - Added the required column `survey_type` to the `match_surveys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "match"."match_surveys" DROP COLUMN "surveyType",
ADD COLUMN     "survey_type" "match"."survey_type" NOT NULL;
