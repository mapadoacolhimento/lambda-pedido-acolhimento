/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `volunteers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "volunteers_email_0093da6f_uniq" ON "public"."volunteers"("email");

-- CreateIndex
CREATE INDEX "volunteers_email_0093da6f_like" ON "public"."volunteers"("email");
