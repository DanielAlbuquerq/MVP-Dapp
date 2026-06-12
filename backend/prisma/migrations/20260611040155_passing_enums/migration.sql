-- This is an empty migration.  -- This is an empty migration.
UPDATE "Category" 
SET "categoryType" = UPPER("name")::"CategoryType";

ALTER TABLE "Category" ALTER COLUMN "categoryType" SET NOT NULL;