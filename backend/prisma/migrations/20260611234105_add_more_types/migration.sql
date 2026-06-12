/*
  Warnings:

  - Added the required column `totalItems` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'RECEIVED';
ALTER TYPE "OrderStatus" ADD VALUE 'PREPARING';
ALTER TYPE "OrderStatus" ADD VALUE 'ON_THE_WAY';
ALTER TYPE "OrderStatus" ADD VALUE 'DELIVERED';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "totalDiscount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "totalItems" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discount" DOUBLE PRECISION DEFAULT 0;
