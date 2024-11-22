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

/** Type for storing component values and depreciation*/
export type componentBreakdownType = {
  /** Component value as percentage of total house value */
  percentageOfHouse: number, 
  /** Percentage of the component's total value that is written-down yearly */
  depreciationPercentageYearly: number
}

export type houseBreakdownType = {
  foundations: componentBreakdownType,
  structureEnvelope: componentBreakdownType,
  cladding: componentBreakdownType,
  roofing: componentBreakdownType,
  windows: componentBreakdownType,
  internalLinings: componentBreakdownType,
  bathroomFixtures: componentBreakdownType,
  fitout: componentBreakdownType,
  kitchenUnits: componentBreakdownType,
  electricalAppliances: componentBreakdownType,
  electricalServices: componentBreakdownType,
  ventilationServices: componentBreakdownType,
  waterAndHeatingServices: componentBreakdownType,
  floorCoverings: componentBreakdownType,
  landscaping: componentBreakdownType,
}

export const HOUSE_BREAKDOWN_PERCENTAGES: houseBreakdownType = {
  foundations: {
    percentageOfHouse: .2049,
    depreciationPercentageYearly: 0,
  },
  structureEnvelope: {
    percentageOfHouse: .2459, 
    depreciationPercentageYearly: 0
  },
  cladding: {
    percentageOfHouse: .041, 
    depreciationPercentageYearly: .0249
  },
  roofing: {
    percentageOfHouse: .041, 
    depreciationPercentageYearly: .0237
  },
  windows: {
    percentageOfHouse: .041, 
    depreciationPercentageYearly: .023
  },
  internalLinings: {
    percentageOfHouse: .041, 
    depreciationPercentageYearly: .032
  },
  bathroomFixtures: {
    percentageOfHouse: .041, 
    depreciationPercentageYearly: .05
  },
  fitout: {
    percentageOfHouse: .0492, 
    depreciationPercentageYearly: .0417
  },
  kitchenUnits: {
    percentageOfHouse: .041, 
    depreciationPercentageYearly: .0556
  },
  electricalAppliances: {
    percentageOfHouse: .041, 
    depreciationPercentageYearly: .0833
  },
  electricalServices: {
    percentageOfHouse: .041, 
    depreciationPercentageYearly: .0493
  },
  ventilationServices: {
    percentageOfHouse: .041, 
    depreciationPercentageYearly: .0667
  },
  waterAndHeatingServices: {
    percentageOfHouse: .082, 
    depreciationPercentageYearly: .0357
  },
  floorCoverings: {
    percentageOfHouse: .0205, 
    depreciationPercentageYearly: .039
  },
  landscaping: {
    percentageOfHouse: .0287, 
    depreciationPercentageYearly: .0343
  },
}