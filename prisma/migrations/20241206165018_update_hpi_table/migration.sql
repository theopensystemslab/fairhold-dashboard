-- AlterTable
ALTER TABLE "hpi" 
RENAME COLUMN "ladcode" TO "lad_code";

-- AlterTable
ALTER TABLE "hpi"
ALTER COLUMN "region" SET NOT NULL,
ALTER COLUMN "itl3" SET NOT NULL,
ALTER COLUMN "hpi_2000" SET NOT NULL;
