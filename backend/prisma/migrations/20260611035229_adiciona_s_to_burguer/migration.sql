/*
  Warnings:

  - The values [HAMBURGUE] on the enum `CategoryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryType_new" AS ENUM ('LANCHES', 'VITAMINAS', 'BEBIDAS', 'DOCES', 'PIZZAS', 'HAMBURGUER', 'SALGADOS', 'OUTROS', 'RAPIDAO');
ALTER TABLE "public"."Category" ALTER COLUMN "categoryType" DROP DEFAULT;
ALTER TABLE "Category" ALTER COLUMN "categoryType" TYPE "CategoryType_new" USING ("categoryType"::text::"CategoryType_new");
ALTER TYPE "CategoryType" RENAME TO "CategoryType_old";
ALTER TYPE "CategoryType_new" RENAME TO "CategoryType";
DROP TYPE "public"."CategoryType_old";
ALTER TABLE "Category" ALTER COLUMN "categoryType" SET DEFAULT 'OUTROS';
COMMIT;
