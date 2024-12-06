/*
  Warnings:

  - You are about to drop the `buildprices` table. If the table is not empty, all the data it contains will be lost.

*/
-- Alter table
ALTER TABLE "buildprices" RENAME TO "build_prices";

-- Alter table
ALTER TABLE "build_prices" RENAME COLUMN "housetype" TO "house_type";
ALTER TABLE "build_prices" RENAME COLUMN "pricerange" TO "price_range";
ALTER TABLE "build_prices" RENAME COLUMN "pricemid" TO "price_mid";