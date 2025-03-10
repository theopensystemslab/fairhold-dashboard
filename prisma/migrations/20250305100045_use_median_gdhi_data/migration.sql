-- delete all data
DELETE FROM "gdhi";

-- change ITL3 to ITL1
ALTER TABLE "gdhi" DROP COLUMN "itl3",
ADD COLUMN     "itl1" VARCHAR(250) NOT NULL;

-- insert median data
-- itl1, region, gdhi
INSERT INTO "gdhi" (itl1, region, gdhi)
VALUES ('TLC', 'North East', 30366),
('TLD', 'North West', 28802),
('TLE', 'Yorkshire and The Humber', 30084),
('TLF', 'East Midlands', 31414),
('TLG', 'West Midlands', 28780),
('TLH', 'East of England', 35013),
('TLI', 'London', 37616),
('TLJ', 'South East', 36991),
('TLK', 'South West', 32697);