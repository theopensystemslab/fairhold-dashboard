import { Mortgage, Property, Fairhold, Household } from "./classes";

// ADDED ERROR HANDLING BEFORE ---------------------------------------------------------------------------------------


function calculateFairhold(responseData: any) {
if (!responseData.buildPrice || responseData.buildPrice.length === 0) {
  throw new Error("buildPrice data is missing or empty");
}
if (!responseData.itl3 || responseData.itl3.length === 0) {
  throw new Error("itl3 data is missing or empty");
}

  // define the property object
  const property = new Property(
    responseData.postcode,
    responseData.houseType,
    responseData.houseBedrooms,
    responseData.houseAge,
    responseData.houseSize,
    responseData.buildPrice[0].priceMid,
    responseData.averagePrice,
    responseData.itl3[0].itl3
  );

  // define the household object
  const household = new Household(
    responseData.gdhi[0].gdhi_2020,
    responseData.averageRent,
    responseData.averageSocialRent,
    responseData.rentAdjustements,
    responseData.hpi,
    property
  );
  return console.log(household);
}

export default calculateFairhold;
