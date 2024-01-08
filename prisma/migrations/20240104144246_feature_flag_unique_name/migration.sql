/*
  Warnings:

  - You are about to drop the column `featureEnabled` on the `feature_flag` table. All the data in the column will be lost.
  - You are about to drop the column `featureName` on the `feature_flag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[feature_name]` on the table `feature_flag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `feature_name` to the `feature_flag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "match"."feature_flag_featureName_key";

-- AlterTable
ALTER TABLE "match"."feature_flag" DROP COLUMN "featureEnabled",
DROP COLUMN "featureName",
ADD COLUMN     "feature_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "feature_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "feature_flag_feature_name_key" ON "match"."feature_flag"("feature_name");
