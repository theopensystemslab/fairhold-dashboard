-- AlterTable
ALTER TABLE "social_rent_adjustments" ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "inflation" SET NOT NULL,
ALTER COLUMN "additional" SET NOT NULL,
ALTER COLUMN "total" SET NOT NULL;
