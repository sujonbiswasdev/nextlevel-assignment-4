/*
  Warnings:

  - The `status` column on the `meal` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MealsStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "meal" DROP COLUMN "status",
ADD COLUMN     "status" "MealsStatus" NOT NULL DEFAULT 'APPROVED';

-- DropEnum
DROP TYPE "status";
