import { MaintenanceLevel } from "./constants";

export interface ForecastParameters {
  maintenanceLevel: MaintenanceLevel;
  incomeGrowthPerYear: number;
  rentGrowthPerYear: number;
  constructionPriceGrowthPerYear: number;
  propertyPriceGrowthPerYear: number;
  yearsForecast: number;
  affordabilityThresholdIncomePercentage: number;
}

/** 
 * Parameters for forecasting changing costs over time,
 * all values except years are percentages represented in decimal form
 */
export const DEFAULT_FORECAST_PARAMETERS: ForecastParameters = {
  maintenanceLevel: "low", 
  incomeGrowthPerYear: 0.04,
  constructionPriceGrowthPerYear: 0.025, 
  rentGrowthPerYear: 0.03, 
  propertyPriceGrowthPerYear: 0.05, 
  /** The number of years to forecast values over */
  yearsForecast: 40,
  /** The threshold of GDHI at which housing is no longer considered affordable  */
  affordabilityThresholdIncomePercentage: 0.35, 
} as const;

/**
 * Creates forecast parameters
 * @param maintenanceLevel - Maintenance spend value, user input from form
 * @returns ForecastParameters with updated maintenance spend (overwrites default)
 */
export function createForecastParameters(maintenanceLevel: MaintenanceLevel): ForecastParameters {
  
  // Create new parameters, spreading defaults but overwriting maintenance
  return {
    ...DEFAULT_FORECAST_PARAMETERS,
    maintenanceLevel,
  };
}