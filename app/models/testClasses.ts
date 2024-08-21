import { DEFAULT_FORECAST_PARAMETERS } from "./ForecastParameters";
import { Household } from "./Household";
import { HouseType, Property } from "./Property";
import { MONTHS_PER_YEAR } from "./constants";
import { SocialRentAdjustments } from "./tenure/SocialRent";

// TODO: Share type with backend
export interface ResponseData {
  postcode: string;
  houseType: HouseType;
  houseBedrooms: number;
  buildPrice: number;
  houseAge: number;
  houseSize: number;
  newBuildPricePerMetre: number;
  averagePrice: number;
  itl3: string;
  gdhi: number;
  averageRentMonthly: number;
  socialRentAverageEarning: number;
  socialRentAdjustments: SocialRentAdjustments;
  hpi: number;
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
    averageRentYearly: responseData.averageRentMonthly * MONTHS_PER_YEAR,
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
