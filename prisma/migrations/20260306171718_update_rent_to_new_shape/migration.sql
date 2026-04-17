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