-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "meal" ADD COLUMN     "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING';
