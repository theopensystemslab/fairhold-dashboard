-- CreateTable
CREATE TABLE "prices_paid_summary_filtered" (
    "id" SERIAL NOT NULL,
    "postcode" TEXT NOT NULL,
    "property_type" VARCHAR(250) NOT NULL,
    "granularity_level" VARCHAR(250) NOT NULL,
    "average_price" DOUBLE PRECISION NOT NULL,
    "transaction_count" INTEGER NOT NULL,

    CONSTRAINT "prices_paid_summary_filtered_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prices_paid_summary_filtered_postcode_property_type_idx" ON "prices_paid_summary_filtered"("postcode", "property_type");

-- CreateIndex
CREATE UNIQUE INDEX "prices_paid_summary_filtered_postcode_property_type_granula_key" ON "prices_paid_summary_filtered"("postcode", "property_type", "granularity_level");

-- Insert filtered summary from raw prices_paid data; we are splitting by region and then filtering
WITH area_price_quartiles AS (
  SELECT 
    CASE
      WHEN SUBSTRING(postcode FROM '^[A-Z]{2}') IS NOT NULL THEN LEFT(postcode, 2)
      ELSE LEFT(postcode, 1)
    END as area,
    property_type,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY price) as q1,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY price) as q3
  FROM prices_paid
  GROUP BY 
    CASE
      WHEN SUBSTRING(postcode FROM '^[A-Z]{2}') IS NOT NULL THEN LEFT(postcode, 2)
      ELSE LEFT(postcode, 1)
    END,
    property_type
),
filtered_prices AS (
  SELECT 
    p.*
  FROM prices_paid p
  JOIN area_price_quartiles q 
    ON (CASE
          WHEN SUBSTRING(p.postcode FROM '^[A-Z]{2}') IS NOT NULL THEN LEFT(p.postcode, 2)
          ELSE LEFT(p.postcode, 1)
        END) = q.area
    AND p.property_type = q.property_type
  WHERE p.price BETWEEN q.q1 AND q.q3
)
INSERT INTO prices_paid_summary_filtered (
  postcode,
  property_type,
  granularity_level,
  average_price,
  transaction_count
)
SELECT 
  LEFT(postcode, POSITION(' ' IN postcode) + 1) as postcode,
  property_type,
  'sector' as granularity_level,
  AVG(price) as average_price,
  COUNT(*) as transaction_count
FROM filtered_prices
GROUP BY LEFT(postcode, POSITION(' ' IN postcode) + 1), property_type
UNION ALL
SELECT 
  CASE
    WHEN LENGTH(LEFT(postcode, POSITION(' ' IN postcode) - 1)) >= 4 THEN LEFT(postcode, 4)
    ELSE LEFT(postcode, 3)
  END as postcode,
  property_type,
  'district' as granularity_level,
  AVG(price) as average_price,
  COUNT(*) as transaction_count
FROM filtered_prices
GROUP BY 
  CASE
    WHEN LENGTH(LEFT(postcode, POSITION(' ' IN postcode) - 1)) >= 4 THEN LEFT(postcode, 4)
    ELSE LEFT(postcode, 3)
  END,
  property_type
UNION ALL
SELECT 
  CASE
    WHEN SUBSTRING(postcode FROM '^[A-Z]{2}') IS NOT NULL THEN LEFT(postcode, 2)
    ELSE LEFT(postcode, 1)
  END as postcode,
  property_type,
  'area' as granularity_level,
  AVG(price) as average_price,
  COUNT(*) as transaction_count
FROM filtered_prices
GROUP BY 
  CASE
    WHEN SUBSTRING(postcode FROM '^[A-Z]{2}') IS NOT NULL THEN LEFT(postcode, 2)
    ELSE LEFT(postcode, 1)
  END,
  property_type;