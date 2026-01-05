/*
  Warnings:

  - You are about to drop the column `docsUrl` on the `Provider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Api" ADD COLUMN     "docsUrl" TEXT;

-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "docsUrl";
