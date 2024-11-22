-- CreateTable
CREATE TABLE "buildprices" (
    "id" SERIAL NOT NULL,
    "housetypedescription" VARCHAR(250),
    "housetype" VARCHAR(1),
    "pricerange" VARCHAR(50),
    "pricemid" DOUBLE PRECISION,

    CONSTRAINT "buildprices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gdhi" (
    "id" SERIAL NOT NULL,
    "itllevel" VARCHAR(250),
    "itl3" VARCHAR(250),
    "region" VARCHAR(250),
    "gdhi_2020" DOUBLE PRECISION,

    CONSTRAINT "gdhi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hpi" (
    "id" SERIAL NOT NULL,
    "region" VARCHAR(250),
    "itl3" VARCHAR(250),
    "ladcode" VARCHAR(250),
    "hpi_2000" DOUBLE PRECISION,

    CONSTRAINT "hpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itl_lookup" (
    "postcode" TEXT,
    "district" TEXT,
    "areacode" TEXT,
    "itl3" TEXT,
    "id" SERIAL NOT NULL,

    CONSTRAINT "itl_lookup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricespaid" (
    "id" SERIAL NOT NULL,
    "transactionidentifier" VARCHAR(250),
    "price" DOUBLE PRECISION,
    "postcode" VARCHAR(250),
    "propertytype" VARCHAR(250),
    "newbuild" VARCHAR(250),

    CONSTRAINT "pricespaid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rent" (
    "id" SERIAL NOT NULL,
    "itl3" VARCHAR(250),
    "ladcode" VARCHAR(250),
    "region" VARCHAR(250),
    "monthlymeanrent" DOUBLE PRECISION,

    CONSTRAINT "rent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "soc_rent_adjustments" (
    "year" VARCHAR(10),
    "inflation" DOUBLE PRECISION,
    "additional" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "id" SERIAL NOT NULL,

    CONSTRAINT "soc_rent_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socialrent" (
    "id" SERIAL NOT NULL,
    "county" VARCHAR(250),
    "itl3" VARCHAR(250),
    "earningsperweek" DOUBLE PRECISION,

    CONSTRAINT "socialrent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gas_bills" (
    "id" INTEGER NOT NULL,
    "Region" VARCHAR NOT NULL,
    "itl" VARCHAR NOT NULL,
    "bill" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "gas_bills_pkey" PRIMARY KEY ("id")
);

