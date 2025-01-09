-- AlterTable
ALTER TABLE "gas_bills" RENAME TO "gas_price";
ALTER TABLE "gas_price" RENAME CONSTRAINT "gas_bills_pkey" TO "gas_price_pkey";
