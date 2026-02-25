/*
  Warnings:

  - You are about to drop the column `first_Name` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `last_Name` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "first_Name",
DROP COLUMN "last_Name",
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT;
