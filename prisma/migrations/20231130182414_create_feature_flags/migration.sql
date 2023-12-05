-- CreateTable
CREATE TABLE "match"."feature_flag" (
    "id" BIGSERIAL NOT NULL,
    "featureName" TEXT NOT NULL,
    "featureEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "feature_flag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feature_flag_featureName_key" ON "match"."feature_flag"("featureName");
