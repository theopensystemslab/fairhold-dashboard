import { Mortgage, Property, Fairhold, Household } from "./classes";

const fairhold = new Fairhold(); // set the fairhold
const mortgage = new Mortgage(200000); // set the new mortgage

function calculateFairhold(responseData: any) {
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
  const household = new Household(
    responseData.gdhi[0].gdhi_2020,
    responseData.averageRent,
    responseData.averageSocialRent,
    responseData.rentAdjustements,
    responseData.hpi,
    property,
    mortgage,
    fairhold
  );
  return console.log(household);
}

export default calculateFairhold;
