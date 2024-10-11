-- CreateTable
CREATE TABLE "buildprices" (
    "id" SERIAL NOT NULL,
    "housetypedescription" VARCHAR(250) NOT NULL,
    "housetype" VARCHAR(1) NOT NULL,
    "pricerange" VARCHAR(50) NOT NULL,
    "pricemid" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "buildprices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gdhi" (
    "id" SERIAL NOT NULL,
    "itllevel" VARCHAR(250) NOT NULL,
    "itl3" VARCHAR(250) NOT NULL,
    "region" VARCHAR(250) NOT NULL,
    "gdhi_2020" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "gdhi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hpi" (
    "id" SERIAL NOT NULL,
    "region" VARCHAR(250) NOT NULL,
    "itl3" VARCHAR(250) NOT NULL,
    "ladcode" VARCHAR(250) NOT NULL,
    "hpi_2020" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "hpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itl_lookup" (
    "postcode" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "areacode" TEXT NOT NULL,
    "itl3" TEXT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "itl_lookup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricespaid" (
    "id" SERIAL NOT NULL,
    "transactionidentifier" VARCHAR(250) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "postcode" VARCHAR(250) NOT NULL,
    "propertytype" VARCHAR(250) NOT NULL,
    "newbuild" VARCHAR(250) NOT NULL,

    CONSTRAINT "pricespaid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rent" (
    "id" SERIAL NOT NULL,
    "itl3" VARCHAR(250) NOT NULL,
    "ladcode" VARCHAR(250) NOT NULL,
    "region" VARCHAR(250) NOT NULL,
    "monthlymeanrent" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "rent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "soc_rent_adjustments" (
    "year" VARCHAR(10) NOT NULL,
    "inflation" DOUBLE PRECISION,
    "additional" DOUBLE PRECISION,
    "total" DOUBLE PRECISION NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "soc_rent_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socialrent" (
    "id" SERIAL NOT NULL,
    "county" VARCHAR(250) NOT NULL,
    "itl3" VARCHAR(250) NOT NULL,
    "earningsperweek" DOUBLE PRECISION NOT NULL,

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

