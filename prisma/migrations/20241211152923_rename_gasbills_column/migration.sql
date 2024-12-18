-- AlterTable
ALTER TABLE "gas_bills" RENAME COLUMN "bill" TO "kwh_cost_pence";
ALTER TABLE "gas_bills" RENAME COLUMN "itl" TO "itl1";
ALTER TABLE "gas_bills" RENAME COLUMN "Region" TO "region";
ALTER TABLE "gas_bills" ALTER COLUMN "kwh_cost_pence" SET NOT NULL;
ALTER TABLE "gas_bills" ALTER COLUMN "itl1" SET NOT NULL;