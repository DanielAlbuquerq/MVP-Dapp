-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hashedRefreshToken" TEXT;

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email" text_ops);
