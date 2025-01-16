import { MAINTENANCE_LEVELS, MaintenanceLevel } from "./constants";
import { createForecastParameters, DEFAULT_FORECAST_PARAMETERS } from "./ForecastParameters";

it("can create default forecast parameters", () => {
  const params = createForecastParameters(DEFAULT_FORECAST_PARAMETERS.maintenanceLevel);
  expect(params).toBeDefined();
});

it("correctly sets maintenance percentage while keeping defaults", () => {
  const customMaintenance = "none";
  const params = createForecastParameters(customMaintenance);
  
  expect(params.maintenanceLevel).toBe(customMaintenance);
  expect(params.incomeGrowthPerYear).toBe(DEFAULT_FORECAST_PARAMETERS.incomeGrowthPerYear);
  expect(params.rentGrowthPerYear).toBe(DEFAULT_FORECAST_PARAMETERS.rentGrowthPerYear);
  expect(params.constructionPriceGrowthPerYear).toBe(DEFAULT_FORECAST_PARAMETERS.constructionPriceGrowthPerYear);
  expect(params.propertyPriceGrowthPerYear).toBe(DEFAULT_FORECAST_PARAMETERS.propertyPriceGrowthPerYear);
  expect(params.yearsForecast).toBe(DEFAULT_FORECAST_PARAMETERS.yearsForecast);
  expect(params.affordabilityThresholdIncomePercentage).toBe(DEFAULT_FORECAST_PARAMETERS.affordabilityThresholdIncomePercentage);
});

it("handles different maintenance percentage values", () => {
  Object.keys(MAINTENANCE_LEVELS).forEach(maintenance => {
    const params = createForecastParameters(maintenance as MaintenanceLevel);
    expect(params.maintenanceLevel).toBe(maintenance);
  });
});