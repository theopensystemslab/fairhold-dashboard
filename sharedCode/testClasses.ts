import { Mortgage, Property, FairholdLandPurchase, Household } from "./classes";

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

  // define the household object
  const household = new Household({
    incomePerPerson: responseData.gdhi,
    averageRent: responseData.averageRent,
    socialRentAveEarning: responseData.socialRentAveEarning,
    socialRentAdjustments: responseData.socialRentAdjustments,
    housePriceIndex: responseData.hpi,
    gasBillYearly: responseData.gasBillYearly,
    property: property,
  });
  console.log(household);
  return household;
}

export default calculateFairhold;
