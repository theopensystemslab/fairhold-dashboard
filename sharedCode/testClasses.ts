import { Mortgage, Property, Fairhold } from "./classes";

const fairhold = new Fairhold(); // set the fairhold
const mortgage = new Mortgage(200000); // set the new mortgage

function calculateFairhold(houseData: any) {
  const property = new Property(
    houseData.postcode,
    houseData.houseType,
    houseData.houseBedrooms,
    houseData.houseAge,
    houseData.houseSize,
    houseData.buildPrice,
    houseData.averagePrice
  );
  return console.log(property);
}

export default calculateFairhold;
