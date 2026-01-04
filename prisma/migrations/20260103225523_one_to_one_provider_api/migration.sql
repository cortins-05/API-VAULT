/*
  Warnings:

  - A unique constraint covering the columns `[providerId]` on the table `Api` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Api_providerId_key" ON "Api"("providerId");
