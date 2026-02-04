-- AlterTable
ALTER TABLE "review" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
