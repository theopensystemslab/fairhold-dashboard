import { ValidPostcode } from "../schemas/apiSchema";
import { DEFAULT_FORECAST_PARAMETERS } from "./ForecastParameters";
import { Household } from "./Household";
import { HouseType, Property } from "./Property";
import { MONTHS_PER_YEAR } from "./constants";
import { socialRentAdjustmentTypes } from "../data/socialRentAdjustmentsRepo";

// TODO: Share type with backend
export interface ResponseData {
  postcode: ValidPostcode;
  houseType: HouseType;
  houseBedrooms: number;
  buildPrice: number;
  houseAge: number;
  houseSize: number;
  averageMarketPrice: number;
  hpi2000: number;
  itl3: string;
  gdhi: number;
  averageRentMonthly: number;
  countyAverageEarnings1999: number;
  socialRentAdjustments: socialRentAdjustmentTypes;
  gasBillYearly: number;
}

function calculateFairhold(responseData: ResponseData) {
  if (!responseData.buildPrice) {
    throw new Error("buildPrice data is missing or empty");
  }
  if (!responseData.itl3 || responseData.itl3.length === 0) {
    throw new Error("itl3 data is missing or empty");
  }

  // define the property object
  const property = new Property({
    postcode: responseData.postcode.postcode,
    houseType: responseData.houseType,
    numberOfBedrooms: responseData.houseBedrooms,
    age: responseData.houseAge,
    size: responseData.houseSize,
    newBuildPricePerMetre: responseData.buildPrice,
    averageMarketPrice: responseData.averageMarketPrice,
    hpi2000: responseData.hpi2000,
    itl3: responseData.itl3,
  });

  // define the household object
  const household = new Household({
    incomePerPersonYearly: responseData.gdhi,
    averageRentYearly: responseData.averageRentMonthly * MONTHS_PER_YEAR,
    countyAverageEarnings1999: responseData.countyAverageEarnings1999,
    socialRentAdjustments: responseData.socialRentAdjustments,
    hpi2000: responseData.hpi2000,
    gasBillYearly: responseData.gasBillYearly,
    property: property,
    forecastParameters: DEFAULT_FORECAST_PARAMETERS,
  });
  console.log(household);
  return household;
}

export default calculateFairhold;
