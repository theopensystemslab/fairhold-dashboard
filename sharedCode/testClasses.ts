import { Property, Fairhold, Household } from "./classes";

function calculateFairhold(responseData: any) {
  if (!responseData.buildPrice || responseData.buildPrice.length === 0) {
    throw new Error("buildPrice data is missing or empty");
  }
  if (!responseData.itl3 || responseData.itl3.length === 0) {
    throw new Error("itl3 data is missing or empty");
  }

  // define the property object
  const property = new Property({
    postcode: responseData.postcode,
    houseType: responseData.houseType,
    numberOfBedrooms: responseData.houseBedrooms,
    age: responseData.houseAge,
    size: responseData.houseSize,
    newBuildPricePerMetre: responseData.buildPrice,
    averagePrice: responseData.averagePrice,
    itl3: responseData.itl3,
  });

  // define the forecast parameters
  const forecastParameters = {
    maintenanceCostPercentage: 0.0125, // percentage maintenance cost
    incomeGrowthPerYear: 0.04, // 4% income growth per year
    constructionPriceGrowthPerYear: 0.025, // 2.5%
    rentGrowthPerYear: 0.03, // 3%
    propertyPriceGrowthPerYear: 0.05, // 5%
    yearsForecast: 40, // 40 years
    affordabilityThresholdIncomePercentage: 0.35, // percentage of imcome to afford rent or purchase
  };

  // define the household object
  const household = new Household({
    incomePerPersonYearly: responseData.gdhi,
    averageRentYearly: responseData.averageRentMonthly * 12,
    socialRentAverageEarning: responseData.socialRentAverageEarning,
    socialRentAdjustments: responseData.socialRentAdjustments,
    housePriceIndex: responseData.hpi,
    gasBillYearly: responseData.gasBillYearly,
    property: property,
    forecastParameters: forecastParameters,
  });
  console.log(household);
  return household;
}

export default calculateFairhold;
