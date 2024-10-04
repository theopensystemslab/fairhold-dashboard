import { MarketPurchase } from "./MarketPurchase";

let tenureMarketPurchase: MarketPurchase;

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

  tenureMarketPurchase = new MarketPurchase({
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
  });
});

it("can be instantiated", () => {
  expect(tenureMarketPurchase).toBeInstanceOf(MarketPurchase);
});
