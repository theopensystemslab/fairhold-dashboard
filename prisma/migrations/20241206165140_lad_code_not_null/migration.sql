/*
  Warnings:

  - Made the column `lad_code` on table `hpi` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "hpi" ALTER COLUMN "lad_code" SET NOT NULL;
