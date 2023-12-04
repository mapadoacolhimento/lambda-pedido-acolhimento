-- CreateEnum
CREATE TYPE "match"."survey_type" AS ENUM ('triagem_1', 'triagem_2', 'atendimento_1', 'atendimento_2');

-- CreateTable
CREATE TABLE "match"."match_surveys" (
    "match_survey_id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "surveyType" "match"."survey_type" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "match_surveys_pkey" PRIMARY KEY ("match_survey_id")
);

-- AddForeignKey
ALTER TABLE "match"."match_surveys" ADD CONSTRAINT "match_surveys_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "match"."matches"("match_id") ON DELETE RESTRICT ON UPDATE CASCADE;
