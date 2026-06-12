-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CategoryType" ADD VALUE 'SAUDAVEL';
ALTER TYPE "CategoryType" ADD VALUE 'ESPETINHO';
ALTER TYPE "CategoryType" ADD VALUE 'CAFE';
ALTER TYPE "CategoryType" ADD VALUE 'CAFEDAMANHA';
ALTER TYPE "CategoryType" ADD VALUE 'SORVETE';
ALTER TYPE "CategoryType" ADD VALUE 'DOMAR';
ALTER TYPE "CategoryType" ADD VALUE 'MARMITA';
ALTER TYPE "CategoryType" ADD VALUE 'PADARIA';
ALTER TYPE "CategoryType" ADD VALUE 'PASTEL';
ALTER TYPE "CategoryType" ADD VALUE 'JAPONESA';
ALTER TYPE "CategoryType" ADD VALUE 'BRASILEIRA';
ALTER TYPE "CategoryType" ADD VALUE 'AÇAI';
