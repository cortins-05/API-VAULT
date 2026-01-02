-- CreateEnum
CREATE TYPE "SupportLevel" AS ENUM ('GOOD', 'AVERAGE', 'BAD');

-- CreateEnum
CREATE TYPE "MemoryType" AS ENUM ('BUG', 'INCONSISTENCY', 'UNDOCUMENTED_BEHAVIOR', 'SILENT_CHANGE', 'OTHER');

-- CreateEnum
CREATE TYPE "FlagLevel" AS ENUM ('BLACK', 'GRAY', 'WARNING');

-- CreateEnum
CREATE TYPE "ContextType" AS ENUM ('RECOMMENDED', 'AVOID');

-- CreateTable
CREATE TABLE "Provider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "docsUrl" TEXT,
    "supportLevel" "SupportLevel",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Api" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "providerId" INTEGER NOT NULL,
    "description" TEXT,
    "deprecated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Api_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiMemory" (
    "id" SERIAL NOT NULL,
    "apiId" INTEGER NOT NULL,
    "type" "MemoryType" NOT NULL,
    "content" TEXT NOT NULL,
    "project" TEXT,
    "occurredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiEvaluation" (
    "id" SERIAL NOT NULL,
    "apiId" INTEGER NOT NULL,
    "stability" INTEGER NOT NULL,
    "costValue" INTEGER NOT NULL,
    "performance" INTEGER NOT NULL,
    "support" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiFlag" (
    "id" SERIAL NOT NULL,
    "apiId" INTEGER NOT NULL,
    "level" "FlagLevel" NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiContext" (
    "id" SERIAL NOT NULL,
    "apiId" INTEGER NOT NULL,
    "type" "ContextType" NOT NULL,
    "context" TEXT NOT NULL,

    CONSTRAINT "ApiContext_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Api" ADD CONSTRAINT "Api_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiMemory" ADD CONSTRAINT "ApiMemory_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiEvaluation" ADD CONSTRAINT "ApiEvaluation_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiFlag" ADD CONSTRAINT "ApiFlag_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiContext" ADD CONSTRAINT "ApiContext_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
