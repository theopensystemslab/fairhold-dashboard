#!/bin/bash

QUERY="SELECT 
    source,
    property_type,
    granularity_level,
    COUNT(*) as count,
    MIN(average_price) as min_price,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY average_price) as q1,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY average_price) as median,
    AVG(average_price) as mean,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY average_price) as q3,
    MAX(average_price) as max_price
FROM (
    SELECT 'unfiltered' as source, property_type, granularity_level, average_price
    FROM prices_paid_summary
    UNION ALL
    SELECT 'filtered' as source, property_type, granularity_level, average_price
    FROM prices_paid_summary_filtered
) combined_data
GROUP BY source, property_type, granularity_level
ORDER BY property_type, granularity_level, source"

echo "$QUERY" | psql -h postgres -p 5432 -U "$POSTGRES_USER" -d "$POSTGRES_DATABASE" -A -F "," -o "/backups/price_comparison.csv" -q