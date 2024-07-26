export interface ForecastParameters {
  maintenanceCostPercentage: number;
  incomeGrowthPerYear: number;
  rentGrowthPerYear: number;
  constructionPriceGrowthPerYear: number;
  propertyPriceGrowthPerYear: number;
  yearsForecast: number;
  affordabilityThresholdIncomePercentage: number;
}

export const DEFAULT_FORECAST_PARAMETERS: ForecastParameters = {
  maintenanceCostPercentage: 0.0125, // percentage maintenance cost
  incomeGrowthPerYear: 0.04, // 4% income growth per year
  constructionPriceGrowthPerYear: 0.025, // 2.5%
  rentGrowthPerYear: 0.03, // 3%
  propertyPriceGrowthPerYear: 0.05, // 5%
  yearsForecast: 40, // 40 years
  affordabilityThresholdIncomePercentage: 0.35, // percentage of income to afford rent or purchase
} as const;