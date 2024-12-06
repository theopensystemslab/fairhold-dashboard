-- Alter table
ALTER TABLE "buildprices" RENAME TO "build_prices";

-- Alter table
ALTER TABLE "build_prices" RENAME COLUMN "housetype" TO "house_type";
ALTER TABLE "build_prices" RENAME COLUMN "pricerange" TO "price_range";
ALTER TABLE "build_prices" RENAME COLUMN "pricemid" TO "price_mid";