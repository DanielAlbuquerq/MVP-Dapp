-- DropIndex
DROP INDEX "User_email_idx";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Outros';

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email" text_ops);
