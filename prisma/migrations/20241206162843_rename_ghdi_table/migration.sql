-- AlterTable
ALTER TABLE "gdhi"
RENAME COLUMN "itllevel" TO "itl_level";

-- AlterTable
ALTER TABLE "gdhi"
ALTER COLUMN "itl_level" SET NOT NULL,
ALTER COLUMN "itl3" SET NOT NULL,
ALTER COLUMN "region" SET NOT NULL,
ALTER COLUMN "gdhi_2020" SET NOT NULL;