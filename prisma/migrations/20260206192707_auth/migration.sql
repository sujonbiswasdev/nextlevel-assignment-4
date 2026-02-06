-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('APPROVED', 'REJECT');

-- AlterTable
ALTER TABLE "review" ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'APPROVED';
