export const MONTHS_PER_YEAR = 12;
export const WEEKS_PER_MONTH = 4.2;

export type bedWeightsAndCapsType = {
  numberOfBedrooms: number[];
  weight: number[];
  socialRentCap: number[];
};

/**
 * For calculating social rent; these are the variables for weighting the formula rent by # of bedrooms and checking against weekly rent caps
 */
export const BED_WEIGHTS_AND_CAPS: bedWeightsAndCapsType = {
  numberOfBedrooms: [0, 1, 2, 3, 4, 5, 6],
  weight: [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4],
  socialRentCap: [155.73, 155.73, 164.87, 174.03, 183.18, 192.35, 201.5],
};

export type nationalAverageType = {
  rentWeekly: number;
  propertyValue: number;
  earningsWeekly: number;
};

/**
 * National average values (rents, property prices and earnings) that are used as inputs into the social rent formula
 */
export const NATIONAL_AVERAGES: nationalAverageType = {
  /** The national average rent that must be used, for April 2000, from GOV UK "Policy statement on rents for social housing" */
  rentWeekly: 54.62,
  /** The national average property value that must be used, for January 1999, from GOV UK "Policy statement on rents for social housing" */
  propertyValue: 49750,
  /** The national average earnings from New Earning Survey in 1999 prices, from GOV UK "Policy statement on rents for social housing" */
  earningsWeekly: 316.4,
};
