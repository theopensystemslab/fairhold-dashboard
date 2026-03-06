DROP TABLE IF EXISTS "rent";

/*
  Warnings:

  - You are about to drop the column `bedrooms` on the `rent` table. All the data in the column will be lost.
  - You are about to drop the column `monthly_mean_rent` on the `rent` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `rent` table. All the data in the column will be lost.
  - Added the required column `area_name` to the `rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `average_rent` to the `rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent_1br` to the `rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent_2br` to the `rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent_3br` to the `rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent_4plusbr` to the `rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent_detached` to the `rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent_flat_maisonette` to the `rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent_semidetached` to the `rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rent_terraced` to the `rent` table without a default value. This is not possible if the table is not empty.

*/

CREATE TABLE "rent" (
    "id" SERIAL NOT NULL,
    "itl3" VARCHAR(250) NOT NULL,
    "lad_code" VARCHAR(250) NOT NULL,
    "area_name" VARCHAR(250) NOT NULL,
    "average_rent" DOUBLE PRECISION NOT NULL,
    "rent_1br" DOUBLE PRECISION NOT NULL,
    "rent_2br" DOUBLE PRECISION NOT NULL,
    "rent_3br" DOUBLE PRECISION NOT NULL,
    "rent_4plusbr" DOUBLE PRECISION NOT NULL,
    "rent_detached" DOUBLE PRECISION NOT NULL,
    "rent_semidetached" DOUBLE PRECISION NOT NULL,
    "rent_terraced" DOUBLE PRECISION NOT NULL,
    "rent_flat_maisonette" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "rent_pkey" PRIMARY KEY ("id")
);

-- following the pattern of not committing data, the INSERT statement will be run directly on production after testing on local db