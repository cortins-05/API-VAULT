-- DropForeignKey
ALTER TABLE "ApiContext" DROP CONSTRAINT "ApiContext_apiId_fkey";

-- DropForeignKey
ALTER TABLE "ApiEvaluation" DROP CONSTRAINT "ApiEvaluation_apiId_fkey";

-- DropForeignKey
ALTER TABLE "ApiFlag" DROP CONSTRAINT "ApiFlag_apiId_fkey";

-- DropForeignKey
ALTER TABLE "ApiMemory" DROP CONSTRAINT "ApiMemory_apiId_fkey";

-- AddForeignKey
ALTER TABLE "ApiMemory" ADD CONSTRAINT "ApiMemory_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiEvaluation" ADD CONSTRAINT "ApiEvaluation_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiFlag" ADD CONSTRAINT "ApiFlag_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiContext" ADD CONSTRAINT "ApiContext_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api"("id") ON DELETE CASCADE ON UPDATE CASCADE;
