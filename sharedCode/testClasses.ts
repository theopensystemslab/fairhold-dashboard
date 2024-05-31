import { Mortgage, Property, Fairhold, Household } from "./classes";

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
    responseData.buildPrice,
    responseData.averagePrice,
    responseData.itl3
  );
  const household = new Household(
    responseData.gdhi,
    responseData.averageRent,
    responseData.averageSocialRent,
    responseData.hpi,
    responseData.averagePrice,
    property
  );
  return console.log(property, household);
}

export default calculateFairhold;
