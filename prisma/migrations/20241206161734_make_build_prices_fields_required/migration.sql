/*
  Warnings:

  - Made the column `house_type_description` on table `build_prices` required. This step will fail if there are existing NULL values in that column.
  - Made the column `house_type` on table `build_prices` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price_range` on table `build_prices` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price_mid` on table `build_prices` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "build_prices" ALTER COLUMN "house_type_description" SET NOT NULL,
ALTER COLUMN "house_type" SET NOT NULL,
ALTER COLUMN "price_range" SET NOT NULL,
ALTER COLUMN "price_mid" SET NOT NULL;
