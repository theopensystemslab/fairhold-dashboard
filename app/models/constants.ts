export const MONTHS_PER_YEAR = 12;
export const WEEKS_PER_MONTH = 4.2;

export type bedWeightsAndCapsType = {
  numberOfBedrooms: number[];
  weight: number[];
  socialRentCap: number[];
};

/**
 * multiplying value weight and social rent cap for a property based on number of bed rooms
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
 * National average values
 */
export const NATIONAL_AVERAGES: nationalAverageType = {
  socialRentWeekly: 54.62,
  propertyValue: 49750,
  earningsWeekly: 316.4,
};

export const MAINTENANCE_LEVELS = [0.015, 0.02, 0.0375] as const;
