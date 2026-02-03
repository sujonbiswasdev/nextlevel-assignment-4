/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Customer',
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'activate';

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Status";
