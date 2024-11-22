import { createForecastParameters, DEFAULT_FORECAST_PARAMETERS } from "./ForecastParameters";

it("can create default forecast parameters", () => {
  const params = createForecastParameters(DEFAULT_FORECAST_PARAMETERS.maintenancePercentage);
  expect(params).toBeDefined();
});

it("correctly sets maintenance percentage while keeping defaults", () => {
  const customMaintenance = 0.015;
  const params = createForecastParameters(customMaintenance);
  
  expect(params.maintenancePercentage).toBe(customMaintenance);
  expect(params.incomeGrowthPerYear).toBe(DEFAULT_FORECAST_PARAMETERS.incomeGrowthPerYear);
  expect(params.rentGrowthPerYear).toBe(DEFAULT_FORECAST_PARAMETERS.rentGrowthPerYear);
  expect(params.constructionPriceGrowthPerYear).toBe(DEFAULT_FORECAST_PARAMETERS.constructionPriceGrowthPerYear);
  expect(params.propertyPriceGrowthPerYear).toBe(DEFAULT_FORECAST_PARAMETERS.propertyPriceGrowthPerYear);
  expect(params.yearsForecast).toBe(DEFAULT_FORECAST_PARAMETERS.yearsForecast);
  expect(params.affordabilityThresholdIncomePercentage).toBe(DEFAULT_FORECAST_PARAMETERS.affordabilityThresholdIncomePercentage);
});

it("handles different maintenance percentage values", () => {
  const testCases = [0.015, 0.02, 0.0375];
  
  testCases.forEach(maintenance => {
    const params = createForecastParameters(maintenance);
    expect(params.maintenancePercentage).toBe(maintenance);
  });
});