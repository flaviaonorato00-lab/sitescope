/*
  Warnings:

  - You are about to drop the column `name` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[url]` on the table `Site` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `strategy` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostname` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_userId_fkey";

-- AlterTable
ALTER TABLE "Audit" ADD COLUMN     "strategy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "name",
DROP COLUMN "userId",
ADD COLUMN     "hostname" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE INDEX "Audit_siteId_createdAt_idx" ON "Audit"("siteId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Site_url_key" ON "Site"("url");
