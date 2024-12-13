-- AlterTable
ALTER TABLE "prices_paid" ALTER COLUMN "transaction_identifier" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "postcode" SET NOT NULL,
ALTER COLUMN "property_type" SET NOT NULL,
ALTER COLUMN "newbuild" SET NOT NULL;
