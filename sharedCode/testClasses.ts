import { Mortgage, House, Fairhold } from "./classes";

const fairhold = new Fairhold(); // set the fairhold
const mortgage = new Mortgage(200000); // set the new mortgage

function calculateFairhold(houseData: any) {
  console.log(houseData.buildPrice.priceMid);
  const house = new House(
    houseData.granularityPostcode,
    houseData.houseType,
    houseData.houseBedrooms,
    houseData.houseAge,
    houseData.houseSize,
    houseData.buildPrice[0].priceMid
  );
  return console.log(house);
}

export default calculateFairhold;
