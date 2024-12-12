-- Alter table
ALTER TABLE "socialrent" RENAME TO "social_rent_earnings";

-- Alter table
ALTER TABLE "social_rent_earnings" RENAME COLUMN "earningsperweek" TO "earnings_per_week";