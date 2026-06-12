-- 2. Copy and convert the data
UPDATE "Category" SET "categoryType" = upper("name")::"CategoryType";
