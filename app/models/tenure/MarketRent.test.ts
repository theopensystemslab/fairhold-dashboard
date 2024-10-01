import { MarketRent } from "./MarketRent";

let tenureMarketRent: MarketRent;

beforeEach(() => {
  const forecastParameters = {
    maintenanceCostPercentage: 0.0125, // percentage maintenance cost
    incomeGrowthPerYear: 0.04, // 4% income growth per year
    consumerPriceGrowthPerYear: 0.025, // 2.5%
    rentGrowthPerYear: 0.03, // 3%
    propertyPriceGrowthPerYear: 0.05, // 5%
    yearsForecast: 40, // 40 years
    affordabilityThresholdIncomePercentage: 0.35, // percentage of imcome to afford rent or purchase
  };

  tenureMarketRent = new MarketRent({
    averageRentYearly: 20000,
    incomeYearly: 45816,
    averagePrice: 218091.58,
    newBuildPrice: 186560,
    depreciatedBuildPrice: 110717.45,
    landPrice: 31531.579,
    propertyPriceGrowthPerYear: forecastParameters.propertyPriceGrowthPerYear,
    consumerPriceGrowthPerYear:
      forecastParameters.consumerPriceGrowthPerYear,
    yearsForecast: forecastParameters.yearsForecast,
    maintenanceCostPercentage: forecastParameters.maintenanceCostPercentage,
    rentGrowthPerYear: forecastParameters.rentGrowthPerYear,
  });
});

it("can be instantiated", () => {
  expect(tenureMarketRent).toBeInstanceOf(MarketRent);
});
