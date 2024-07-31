import { Property } from "../Property";
import { MarketRent } from "./MarketRent";

let tenureMarketRent: MarketRent;

beforeEach(() => {
  let forecastParameters = {
    maintenanceCostPercentage: 0.0125, // percentage maintenance cost
    incomeGrowthPerYear: 0.04, // 4% income growth per year
    constructionPriceGrowthPerYear: 0.025, // 2.5%
    rentGrowthPerYear: 0.03, // 3%
    propertyPriceGrowthPerYear: 0.05, // 5%
    yearsForecast: 40, // 40 years
    affordabilityThresholdIncomePercentage: 0.35, // percentage of imcome to afford rent or purchase
  };

  let property = new Property({
    postcode: "WV8 1HG",
    houseType: "T",
    numberOfBedrooms: 2,
    age: 10,
    size: 88,
    newBuildPricePerMetre: 2120,
    averageMarketPrice: 218091.58,
    itl3: "TLG24",
  });

  tenureMarketRent = new MarketRent({
    averageRentYearly: 20000,
    incomeYearly: 45816,
    averagePrice: 218091.58,
    newBuildPrice: 186560,
    depreciatedBuildPrice: 110717.45,
    landPrice: 31531.579,
    propertyPriceGrowthPerYear: forecastParameters.propertyPriceGrowthPerYear,
    constructionPriceGrowthPerYear:
      forecastParameters.constructionPriceGrowthPerYear,
    yearsForecast: forecastParameters.yearsForecast,
    maintenanceCostPercentage: forecastParameters.maintenanceCostPercentage,
    rentGrowthPerYear: forecastParameters.rentGrowthPerYear,
  });
});

it("can be instantiated", () => {
  expect(tenureMarketRent).toBeInstanceOf(MarketRent);
});
