export const MONTHS_PER_YEAR = 12;
export const WEEKS_PER_MONTH = 4.2;

export type bedWeightsAndCapsType = {
  numberOfBedrooms: number[];
  weight: number[];
  socialRentCap: number[];
};

/**
 * This is used to weight social rent values by property size based on number of bedrooms
 */
export const BED_WEIGHTS_AND_CAPS: bedWeightsAndCapsType = {
  numberOfBedrooms: [0, 1, 2, 3, 4, 5, 6],
  weight: [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4],
  socialRentCap: [155.73, 155.73, 164.87, 174.03, 183.18, 192.35, 201.5],
};

export type nationalAverageType = {
  socialRentWeekly: number;
  propertyValue: number;
  earningsWeekly: number;
};

/**
 * National averages from 1999 and 2000 (from MHCLG), used as inputs for calculating social rent
 */
export const NATIONAL_AVERAGES: nationalAverageType = {
  socialRentWeekly: 54.62,
  propertyValue: 49750,
  earningsWeekly: 316.4,
};

/** 
 * Maintenance levels are percentages (represented as decimals),
 * figures from our own model
 */
export const MAINTENANCE_LEVELS = [0.015, 0.02, 0.0375] as const;
