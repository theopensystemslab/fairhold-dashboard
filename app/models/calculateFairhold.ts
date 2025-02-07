import { ValidPostcode } from "../schemas/calculationSchema";
import { createForecastParameters } from "./ForecastParameters";
import { Household } from "./Household";
import { HouseType, Property } from "./Property";
import { MaintenanceLevel, MONTHS_PER_YEAR } from "./constants";
import { socialRentAdjustmentTypes } from "../data/socialRentAdjustmentsRepo";

// TODO: Share type with backend
export interface ResponseData {
  postcode: ValidPostcode;
  houseType: HouseType;
  houseBedrooms: number;
  buildPrice: number;
  houseAge: number;
  houseSize: number;
  maintenanceLevel: MaintenanceLevel;
  averagePrice: number;
  itl3: string;
  gdhi: number;
  averageRentMonthly: number;
  socialRentAverageEarning: number;
  socialRentAdjustments: socialRentAdjustmentTypes;
  hpi: number;
  kwhCostPence: number;
}

function calculateFairhold(responseData: ResponseData) {
  if (!responseData.buildPrice) {
    throw new Error("buildPrice data is missing or empty");
  }
  if (!responseData.itl3 || responseData.itl3.length === 0) {
    throw new Error("itl3 data is missing or empty");
  }
  if (!responseData.maintenanceLevel) {
    throw new Error("maintenanceLevel data is missing or empty");
  }

  // define the property object
  const property = new Property({
    postcode: responseData.postcode.postcode,
    houseType: responseData.houseType,
    numberOfBedrooms: responseData.houseBedrooms,
    age: responseData.houseAge,
    size: responseData.houseSize,
    maintenanceLevel: responseData.maintenanceLevel,
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
    kwhCostPence: responseData.kwhCostPence,
    property: property,
    forecastParameters: createForecastParameters(responseData.maintenanceLevel),
  });

  return household;
}

export default calculateFairhold;
