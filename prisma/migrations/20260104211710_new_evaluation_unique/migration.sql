/*
  Warnings:

  - A unique constraint covering the columns `[apiId]` on the table `ApiEvaluation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ApiEvaluation_apiId_key" ON "ApiEvaluation"("apiId");
