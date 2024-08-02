import { DEFAULT_FORECAST_PARAMETERS } from "./ForecastParameters";
import { Household } from "./Household";
import { Property } from "./Property";

function calculateFairhold(responseData) {
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
    averageMarketPrice: responseData.averagePrice,
    itl3: responseData.itl3,
  });

  // define the household object
  const household = new Household({
    incomePerPersonYearly: responseData.gdhi,
    averageRentYearly: responseData.averageRentMonthly * 12,
    socialRentAverageEarning: responseData.socialRentAverageEarning,
    socialRentAdjustments: responseData.socialRentAdjustments,
    housePriceIndex: responseData.hpi,
    gasBillYearly: responseData.gasBillYearly,
    property: property,
    forecastParameters: DEFAULT_FORECAST_PARAMETERS,
  });
  console.log(household);
  return household;
}

export default calculateFairhold;
