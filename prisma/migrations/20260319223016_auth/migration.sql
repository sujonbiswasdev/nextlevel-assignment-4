/*
  Warnings:

  - You are about to alter the column `phone` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(15)`.
  - Made the column `phone` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(15);
