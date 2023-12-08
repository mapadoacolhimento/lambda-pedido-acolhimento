/*
  Warnings:

  - The values [atendimento_1,atendimento_2] on the enum `survey_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "match"."survey_type_new" AS ENUM ('triagem_1', 'triagem_2', 'acompanhamento_1', 'acompanhamento_2');
ALTER TABLE "match"."match_surveys" ALTER COLUMN "survey_type" TYPE "match"."survey_type_new" USING ("survey_type"::text::"match"."survey_type_new");
ALTER TYPE "match"."survey_type" RENAME TO "survey_type_old";
ALTER TYPE "match"."survey_type_new" RENAME TO "survey_type";
DROP TYPE "match"."survey_type_old";
COMMIT;
