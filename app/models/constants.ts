export const MONTHS_PER_YEAR = 12;
export const WEEKS_PER_MONTH = 4.2;

export type BedWeightsAndCaps = {
  numberOfBedrooms: number[];
  weight: number[];
  socialRentCap: number[];
};

/**
 * This is used to weight social rent values by property size based on number of bedrooms
 */
export const BED_WEIGHTS_AND_CAPS: BedWeightsAndCaps = {
  numberOfBedrooms: [0, 1, 2, 3, 4, 5, 6],
  weight: [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4],
  socialRentCap: [155.73, 155.73, 164.87, 174.03, 183.18, 192.35, 201.5],
};

export type NationalAverage = {
  socialRentWeekly: number;
  propertyValue: number;
  earningsWeekly: number;
};

/**
 * National averages from 1999 and 2000 (from MHCLG), used as inputs for calculating social rent
 */
export const NATIONAL_AVERAGES: NationalAverage = {
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
export type ComponentBreakdown = {
  /** Component value as percentage of total house value */
  percentageOfHouse: number, 
  /** Percentage of the component's total value that is written-down yearly */
  depreciationPercentageYearly: number,
  /** Percentage of the yearly maintenance spend allocated to component */
  percentOfMaintenanceYearly: number
}

export type HouseBreakdown = {
  foundations: ComponentBreakdown,
  structureEnvelope: ComponentBreakdown,
  cladding: ComponentBreakdown,
  roofing: ComponentBreakdown,
  windows: ComponentBreakdown,
  internalLinings: ComponentBreakdown,
  bathroomFixtures: ComponentBreakdown,
  fitout: ComponentBreakdown,
  kitchenUnits: ComponentBreakdown,
  electricalAppliances: ComponentBreakdown,
  electricalServices: ComponentBreakdown,
  ventilationServices: ComponentBreakdown,
  waterAndHeatingServices: ComponentBreakdown,
  floorCoverings: ComponentBreakdown,
  landscaping: ComponentBreakdown,
}

/** 
 * Object (key = component, value = another object with `percentageOfHouse`, `deprecationPercentageYearly` and `percentOfMaintenanceYearly`). Contains a breakdown of a house by component, and the percentage of total value it constitutes:
 * foundations 21%, structure 25%, cladding 4%, roofing 4%, windows 4%, internal linings 4%, bathroom 4%, fitout 5%,
 * kitchen units 4%, electrical appliances 4%, electrical services 4%, ventilation services 4%, water and heating services 8%,
 * floor coverings 2%, landscaping 3%*/
export const HOUSE_BREAKDOWN_PERCENTAGES: HouseBreakdown = {
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