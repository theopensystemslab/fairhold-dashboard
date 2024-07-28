
import * as math from "mathjs";

/**
 * Number of decimal places to use when rounding numerical values
 */
const PRECISION = 2
const DEPRECIATION_FACTOR = -32938;

type PropertyParams = Pick<
  Property,
  | "postcode"
  | "houseType"
  | "numberOfBedrooms"
  | "age"
  | "size"
  | "newBuildPricePerMetre"
  | "averageMarketPrice"
  | "itl3"
>;

// TODO: Reuse HouseType enum
type HouseType = "D" | "S" | "T" | "F";

export class Property {
  postcode: string;
  houseType: HouseType;
  numberOfBedrooms: number;
  age: number;
  /**
   * Size of the house in squares meters
   */
  size: number;
  /**
   * Average build price per metre of a new house
   */
  newBuildPricePerMetre: number;
  averageMarketPrice: number;
  itl3: string;
  /**
   *  Price of the house if it was new
   */
  newBuildPrice: number;
  /**
   * Price of the house according to the depreciation regression
   */
  depreciatedBuildPrice: number;
  /**
   * Price of the house weighted by the number of bedrooms
   */
  bedWeightedAveragePrice: number;
  landPrice: number;
  /**
   * Ratio of the land price to the total price
   */
  landToTotalRatio: number;

  constructor(params: PropertyParams) {
    this.postcode = params.postcode;
    this.houseType = params.houseType;
    this.numberOfBedrooms = params.numberOfBedrooms;
    this.age = params.age;
    this.size = params.size;
    this.newBuildPricePerMetre = params.newBuildPricePerMetre;
    this.averageMarketPrice = params.averageMarketPrice;
    this.itl3 = params.itl3;

    // Computed properties, order is significant
    this.newBuildPrice = this.calculateNewBuildPrice();
    this.depreciatedBuildPrice = this.calculateDepreciatedBuildPrice();
    this.bedWeightedAveragePrice = this.calculateBedWeightedAveragePrice();
    this.landPrice = this.averageMarketPrice - this.newBuildPrice;
    this.landToTotalRatio = this.landPrice / this.bedWeightedAveragePrice;
  }

  private calculateNewBuildPrice() {
    let newBuildPrice = this.newBuildPricePerMetre * this.size;
    newBuildPrice = parseFloat(newBuildPrice.toFixed(PRECISION));

    return newBuildPrice;
  }

  private calculateDepreciatedBuildPrice() {
    let depreciatedBuildPrice =
      this.newBuildPrice + DEPRECIATION_FACTOR * math.log(this.age);
    depreciatedBuildPrice = parseFloat(
      depreciatedBuildPrice.toFixed(PRECISION)
    );

    return depreciatedBuildPrice;
  }

  private calculateBedWeightedAveragePrice(
    beds: number[] = [0, 1, 2, 3, 4, 5, 6],
    bedWeights: number[] = [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4],
  ) {
    let bedWeight;

    if (this.numberOfBedrooms < beds[beds.length - 1]) {
      // assign the weight based on the number of beds
      bedWeight = bedWeights[this.numberOfBedrooms];
    } else {
      // assign the last value if out of scale
      bedWeight = bedWeights[bedWeights.length - 1];
    }

    bedWeight = parseFloat(
      (bedWeight * this.averageMarketPrice).toFixed(PRECISION)
    );

    return bedWeight;
  }
}