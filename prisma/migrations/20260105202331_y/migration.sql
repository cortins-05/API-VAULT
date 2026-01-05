-- DropForeignKey
ALTER TABLE "Api" DROP CONSTRAINT "Api_providerId_fkey";

-- AddForeignKey
ALTER TABLE "Api" ADD CONSTRAINT "Api_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
