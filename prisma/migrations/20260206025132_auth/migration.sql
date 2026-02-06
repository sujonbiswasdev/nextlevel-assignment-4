/*
  Warnings:

  - Added the required column `cuisine` to the `meal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meal" ADD COLUMN     "cuisine" TEXT NOT NULL;
