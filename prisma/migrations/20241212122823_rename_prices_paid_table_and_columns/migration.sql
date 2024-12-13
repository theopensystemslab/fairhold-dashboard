-- Alter table
ALTER TABLE "pricespaid" RENAME TO "prices_paid";

-- Alter table
ALTER TABLE "prices_paid" RENAME COLUMN "propertytype" TO "property_type";
ALTER TABLE "prices_paid" RENAME COLUMN "transactionidentifier" TO "transaction_identifier";