import { Mortgage, Property, Fairhold, Household } from "./classes";

function calculateFairhold(responseData: any) {
  // define the property object
  const property = new Property({
    postcode: responseData.postcode,
    houseType: responseData.houseType,
    numberOfBedrooms: responseData.houseBedrooms,
    age: responseData.houseAge,
    size: responseData.houseSize,
    newBuildPricePerMetre: responseData.buildPrice[0].priceMid,
    averagePrice: responseData.averagePrice,
    itl3: responseData.itl3[0].itl3,
  });

  // define the household object
  const household = new Household({
    incomePerPerson: responseData.gdhi[0].gdhi_2020,
    averageRent: responseData.averageRent,
    socialRentAveEarning: responseData.averageSocialRent,
    rentAdjustements: responseData.rentAdjustements,
    housePriceIndex: responseData.hpi,
    property: property,
  });
  return console.log(household);
}

export default calculateFairhold;
