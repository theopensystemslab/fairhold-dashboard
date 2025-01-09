-- CreateTable
CREATE TABLE "prices_paid_summary" (
    "id" SERIAL NOT NULL,
    "postcode" TEXT NOT NULL,
    "property_type" VARCHAR(250) NOT NULL,
    "granularity_level" VARCHAR(250) NOT NULL,
    "average_price" DOUBLE PRECISION NOT NULL,
    "transaction_count" INTEGER NOT NULL,

    CONSTRAINT "prices_paid_summary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prices_paid_summary_postcode_property_type_idx" ON "prices_paid_summary"("postcode", "property_type");

-- CreateIndex
CREATE UNIQUE INDEX "prices_paid_summary_postcode_property_type_granularity_leve_key" ON "prices_paid_summary"("postcode", "property_type", "granularity_level");
