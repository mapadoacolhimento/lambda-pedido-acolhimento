-- AlterTable
ALTER TABLE "public"."volunteers" ADD COLUMN     "street" VARCHAR(200),
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "neighborhood" DROP NOT NULL;

-- CreateTable
CREATE TABLE IF NOT EXISTS "match"."feature_flag" (
    "id" BIGSERIAL NOT NULL,
    "featureName" TEXT NOT NULL,
    "featureEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "feature_flag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "feature_flag_featureName_key" ON "match"."feature_flag"("featureName");
