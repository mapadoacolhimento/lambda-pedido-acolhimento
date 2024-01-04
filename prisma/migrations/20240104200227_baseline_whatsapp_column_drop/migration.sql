/*
  Warnings:

  - You are about to drop the column `whatsapp` on the `volunteers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."volunteers" DROP COLUMN IF EXISTS "whatsapp";
