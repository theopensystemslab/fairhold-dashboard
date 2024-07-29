
import * as math from "mathjs";

export class Property {
  postcode; // postcode of the property
  houseType; // type of the house: D--> detached, S--> semidetached, T--> Terrace, F--> Flats
  numberOfBedrooms; // number of bedrooms in the house
  age; // age of the house
  size; // size of the house in metre squares
  newBuildPricePerMetre: number; // average build price per metre of a new house
  averagePrice: number; // average market price
  itl3: string; // ITL code
  newBuildPrice?: number; // price of the house if it was new
  depreciatedBuildPrice?: number; // price of the house according to the depreciation regression
  bedWeightedAveragePrice?: number; // price of the house weigheted by the number of bedrooms
  landPrice?: number; // price of the land
  landToTotalRatio?: number; // ratio of the land price over the total

  constructor({
    postcode,
    houseType,
    numberOfBedrooms,
    age,
    size,
    newBuildPricePerMetre,
    averagePrice,
    itl3,
  }: {
    postcode: any;
    houseType: string;
    numberOfBedrooms: number;
    age: number;
    size: number;
    newBuildPricePerMetre: number;
    averagePrice: number;
    itl3: string;
  }) {
    this.postcode = postcode;
    this.houseType = houseType;
    this.numberOfBedrooms = numberOfBedrooms;
    this.age = age;
    this.size = size;
    this.newBuildPricePerMetre = newBuildPricePerMetre;
    this.averagePrice = averagePrice;
    this.itl3 = itl3;

    this.calculateNewBuildPrice(); // calculate new building price
    this.calculateDepreciatedBuildPrice(); // calculated the depreciated building price
    this.calculateBedWeightedAveragePrice(); // calculate the bed weighted building price
    this.calculateLandPrice(); // calculate the price of the land
    if (
      this.landPrice !== undefined &&
      this.bedWeightedAveragePrice !== undefined
    ) {
      this.landToTotalRatio = this.landPrice / this.bedWeightedAveragePrice; // define the land to total ratio
    }
  }

  // calculate new building price
  calculateNewBuildPrice(precisionRounding: number = 2) {
    if (!this.newBuildPricePerMetre) {
      throw new Error(
        "The Build Price cannot be calculated because pricePerMetre has not been set"
      );
    }
    const newBuildPrice = this.newBuildPricePerMetre * this.size; // calculate the price of the new build
    this.newBuildPrice = parseFloat(newBuildPrice.toFixed(precisionRounding)); // round the number

    return this.newBuildPrice;
  }

  // calculate nthe depraciated building price
  calculateDepreciatedBuildPrice(
    depreciationFactor: number = -32938,
    precisionRounding: number = 2
  ) {
    if (!this.newBuildPrice) {
      throw new Error(
        "The Depreciated Price cannot be calculated because newBuildPrice has not been set"
      );
    }

    const depreciatedBuildPrice =
      this.newBuildPrice + depreciationFactor * math.log(this.age); // depreciated building price
    this.depreciatedBuildPrice = parseFloat(
      depreciatedBuildPrice.toFixed(precisionRounding)
    ); // round the number

    if (this.depreciatedBuildPrice == undefined) {
      throw new Error("depreciatedBuildPrice is undefined");
    }

    return this.depreciatedBuildPrice;
  }

  // calculate the average property price based on the  number of bedrooms
  calculateBedWeightedAveragePrice(
    numberOfBeds: number = this.numberOfBedrooms,
    beds: number[] = [0, 1, 2, 3, 4, 5, 6],
    bedWeights: number[] = [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4],
    precisionRounding: number = 2
  ) {
    let bedWeight; // initialize the variable

    if (numberOfBeds < beds[beds.length - 1]) {
      bedWeight = bedWeights[numberOfBeds]; // assign the weight based on the number of beds
    } else {
      bedWeight = bedWeights[bedWeights.length - 1]; // assign the last value if out of scale
    }

    if (bedWeight == undefined) {
      throw new Error("bedWeight is undefined.");
    }

    return (this.bedWeightedAveragePrice = parseFloat(
      (bedWeight * this.averagePrice).toFixed(precisionRounding)
    )); // calculate the bed weighted average price
  }
  calculateLandPrice() {
    if (this.newBuildPrice == undefined)
      throw new Error("newBuildPrice is undefined");
    return (this.landPrice = this.averagePrice - this.newBuildPrice); // calculate the price of the land
  }
}