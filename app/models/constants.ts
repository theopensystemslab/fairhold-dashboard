import { HouseType } from "./Property";

export const MONTHS_PER_YEAR = 12;
export const WEEKS_PER_MONTH = 4.2;

export const DEFAULT_INTEREST_RATE = 0.06;
export const DEFAULT_MORTGAGE_TERM = 30;
export const DEFAULT_INITIAL_DEPOSIT = 0.15;

export type SocialRentBedWeightsAndCaps = {
  numberOfBedrooms: number[];
  weight: number[];
  socialRentCap: number[];
};

/**
 * This is used to weight social rent values by property size based on number of bedrooms
 */
export const BED_WEIGHTS_AND_CAPS: SocialRentBedWeightsAndCaps = {
  numberOfBedrooms: [0, 1, 2, 3, 4, 5, 6],
  weight: [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4],
  socialRentCap: [155.73, 155.73, 164.87, 174.03, 183.18, 192.35, 201.5],
};

export const SOCIAL_RENT_ADJUSTMENT_FORECAST = .0283  // TODO: decide if this is the best way to increase social rent or if we should preserve the changing land-house ratio as land costs inflate

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
export const MAINTENANCE_LEVELS = {
  none: 0, 
  low: 0.015, 
  medium: 0.019, 
  high: 0.025} as const;

export type MaintenanceLevel = keyof typeof MAINTENANCE_LEVELS;

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

/** 
 * Object (key = component, value = another object with `percentageOfHouse`, `deprecationPercentageYearly` and `percentOfMaintenanceYearly`). Contains a breakdown of a house by component, and the percentage of total value it constitutes:
 * foundations 21%, structure 25%, cladding 4%, roofing 4%, windows 4%, internal linings 4%, bathroom 4%, fitout 5%,
 * kitchen units 4%, electrical appliances 4%, electrical services 4%, ventilation services 4%, water and heating services 8%,
 * floor coverings 2%, landscaping 3%*/
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

export const FOUNDATIONS_LIFETIME = 110
export const STRUCTURE_ENVELOPE_LIFETIME = 65

export type BillsByHouseType = Record<HouseType, number>

/** Figures are from LETI / Studio PDP */
export const KWH_M2_YR_EXISTING_BUILDS: BillsByHouseType = {
  F: 118,
  T: 110,
  S: 168,
  D: 167
}

export const KWH_M2_YR_NEWBUILDS_RETROFIT = {
  F: 26,
  T: 20,
  S: 51,
  D: 55
}

/** from Carbon Independent https://www.carbonindependent.org/15.html#:~:text=Natural%20gas&text=Older%20gas%20meters%20measure%20gas,kg%20%2F%20kWh%20%5B9%5D%20 */
export const KG_CO2_PER_KWH = 0.185

/** from BRE report in 2021, NHS first-year care costs due to poor housing in England individualised according to English Housing Survey 2021–2022 3.5m households in substandard accom figure */
export const NHS_SAVINGS_PER_HOUSE_PER_YEAR = 400
export const SOCIAL_SAVINGS_PER_HOUSE_PER_YEAR = 5286

export const FTE_SPEND = 60000

/** 
 * from Leeds Beckett Wikihouse LCA comparison report: 30.66 tco2e for a 92m2 brick and block home in A1-A5 
 * https://cdn.prod.website-files.com/612569c3243035968aaf61f1/63bd27536d1e152e28e96403_77084_Wikihouse%20Thermal%20Perfromance%20and%20LCA%20report_July%202021.pdf
*/
export const EMBODIED_CARBON_BRICK_BLOCK_KG_M2 = 333.26

/** 
 * from Stride Treglown Gwynfaen embodied emissions estimates: 40,017kg up-front CO2e for life cycle stages A1-A5 and biogenic carbon sequestration of 36,177kg A1-A3 for a 95m2 home
 * https://media.stridetreglown.com/wp-content/uploads/2021/03/23114044/152858_LCA-Case-Study_Gwynfaen-final.pdf
*/
export const EMBODIED_CARBON_TIMBER_SLAB_KG_M2 = 40.421
export type BedroomWeights = {
  [key in HouseType]: {
    [key: number]: number;
  };
};

export const PROPERTY_PRICE_WEIGHTS: BedroomWeights = { // from dwh https://www.dwh.co.uk/advice-and-inspiration/average-house-sizes-uk
  D: {
    1: 0.7,  
    2: 0.8,
    3: 0.9,
    4: 1.0,
    5: 1.1,
    6: 1.2
  },
  S: {
    1: 0.8,
    2: 0.9,
    3: 1.0,
    4: 1.1,
    5: 1.2,
    6: 1.3
  },
  T: {
    1: 0.8,
    2: 0.9,  
    3: 1.0,
    4: 1.1,
    5: 1.2,
    6: 1.3
  },
  F: {
    0: 0.8,
    1: 0.9, 
    2: 1.0, 
    3: 1.1,
    4: 1.2,
    5: 1.3,
    6: 1.4
  }
} as const;

export const HOUSE_SIZE_MAPPINGS: { [key: number]: number } = { // Alastair derived these from English Housing Survey and https://www.gov.uk/government/publications/technical-housing-standards-nationally-described-space-standard/technical-housing-standards-nationally-described-space-standard
  1: 55,
  2: 70,
  3: 95,
  4: 110,
  5: 125,
  6: 135,
} as const;