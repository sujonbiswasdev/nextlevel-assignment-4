/*
  Warnings:

  - Made the column `comment` on table `review` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "review" ALTER COLUMN "comment" SET NOT NULL;
