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

/** Type for storing component values and depreciation*/
export type componentBreakdownType = {
  /** Component value as percentage of total house value */
  percentageOfHouse: number, 
  /** Percentage of the component's total value that is written-down yearly */
  depreciationPercentageYearly: number,
  /** Percentage of the yearly maintenance spend allocated to component */
  percentOfMaintenanceYearly: number
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
    percentageOfHouse: .21,
    depreciationPercentageYearly: 0,
    percentOfMaintenanceYearly: 0
  },
  structureEnvelope: {
    percentageOfHouse: .25, 
    depreciationPercentageYearly: 0,
    percentOfMaintenanceYearly: 0
  },
  cladding: {
    percentageOfHouse: .04, 
    depreciationPercentageYearly: .0249,
    percentOfMaintenanceYearly: .074
  },
  roofing: {
    percentageOfHouse: .04, 
    depreciationPercentageYearly: .0237,
    percentOfMaintenanceYearly: .074
  },
  windows: {
    percentageOfHouse: .04, 
    depreciationPercentageYearly: .023,
    percentOfMaintenanceYearly: .074
  },
  internalLinings: {
    percentageOfHouse: .04, 
    depreciationPercentageYearly: .032,
    percentOfMaintenanceYearly: .074
  },
  bathroomFixtures: {
    percentageOfHouse: .04, 
    depreciationPercentageYearly: .05,
    percentOfMaintenanceYearly: .074
  },
  fitout: {
    percentageOfHouse: .05, 
    depreciationPercentageYearly: .0417,
    percentOfMaintenanceYearly: .093
  },
  kitchenUnits: {
    percentageOfHouse: .04, 
    depreciationPercentageYearly: .0556,
    percentOfMaintenanceYearly: .074
  },
  electricalAppliances: {
    percentageOfHouse: .04, 
    depreciationPercentageYearly: .0833,
    percentOfMaintenanceYearly: .074
  },
  electricalServices: {
    percentageOfHouse: .04, 
    depreciationPercentageYearly: .0493,
    percentOfMaintenanceYearly: .074
  },
  ventilationServices: {
    percentageOfHouse: .04, 
    depreciationPercentageYearly: .0667,
    percentOfMaintenanceYearly: .074
  },
  waterAndHeatingServices: {
    percentageOfHouse: .08, 
    depreciationPercentageYearly: .0357,
    percentOfMaintenanceYearly: .148
  },
  floorCoverings: {
    percentageOfHouse: .02, 
    depreciationPercentageYearly: .039,
    percentOfMaintenanceYearly: .037
  },
  landscaping: {
    percentageOfHouse: .03, 
    depreciationPercentageYearly: .0343,
    percentOfMaintenanceYearly: .056
  },
}