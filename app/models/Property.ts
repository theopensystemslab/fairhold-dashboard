import { BED_WEIGHTS_AND_CAPS, MAINTENANCE_LEVELS, HOUSE_BREAKDOWN_PERCENTAGES } from "./constants";
import { houseBreakdownType } from "./constants";
/**
 * Number of decimal places to use when rounding numerical values
 */
const PRECISION = 2;

type PropertyParams = Pick<
  Property,
  | "postcode"
  | "houseType"
  | "numberOfBedrooms"
  | "age"
  | "size"
  | "maintenancePercentage"
  | "newBuildPricePerMetre"
  | "averageMarketPrice"
  | "itl3"
>;

export const HOUSE_TYPES = ["D", "S", "T", "F"] as const;

export type HouseType = (typeof HOUSE_TYPES)[number];

export type MaintenancePercentage = (typeof MAINTENANCE_LEVELS)[number]

export type ComponentCalculation = {
  newComponentValue: number;
  depreciationFactor: number;
  maintenanceAddition: number;
  depreciatedComponentValue: number;
}

export class Property {
  postcode: string;
  houseType: HouseType;
  numberOfBedrooms: number;
  age: number;
  /**
   * Size of the house in squares meters
   */
  size: number;
  maintenancePercentage: MaintenancePercentage;
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
    this.age = params.age - 1; // Subtract 1 because years should be indexed to 0
    this.size = params.size;
    this.maintenancePercentage = params.maintenancePercentage;
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
    if (this.age === 0) return this.newBuildPrice; // If newbuild, return newBuildPrice and don't depreciate
    
    let depreciatedBuildPrice = 0;

  // Calculate for each component using the public method
  for (const key of Object.keys(HOUSE_BREAKDOWN_PERCENTAGES) as (keyof houseBreakdownType)[]) {
    const result = this.calculateComponentValue(
      key, 
      this.newBuildPrice, 
      this.age, 
      MAINTENANCE_LEVELS[0]
    );

    depreciatedBuildPrice += result.depreciatedComponentValue;
  }
    depreciatedBuildPrice = parseFloat(depreciatedBuildPrice.toFixed(PRECISION))

  return depreciatedBuildPrice;
}

  public calculateComponentValue(
    componentKey: keyof houseBreakdownType,
    newBuildPrice: number,
    age: number,
    maintenanceLevel: number
  ): ComponentCalculation {
    const component = HOUSE_BREAKDOWN_PERCENTAGES[componentKey];
    
    // Calculate new component value
    const newComponentValue = newBuildPrice * component.percentageOfHouse;
    
    // Calculate depreciation
    const depreciationFactor = 1 - (component.depreciationPercentageYearly * age);
    
    // Calculate maintenance (0 for foundations and structure)
    const maintenanceAddition = 
      (componentKey === 'foundations' || componentKey === 'structureEnvelope') 
        ? 0 
        : maintenanceLevel * newBuildPrice * age * component.percentOfMaintenanceYearly;
    
    // Calculate final value
    let depreciatedComponentValue = 
      (newComponentValue * depreciationFactor) + maintenanceAddition;

    depreciatedComponentValue < 0 ? depreciatedComponentValue = 0 : depreciatedComponentValue

    return {
      newComponentValue,
      depreciationFactor,
      maintenanceAddition,
      depreciatedComponentValue
    };
  }

  private calculateBedWeightedAveragePrice() {
    const bedWeights = BED_WEIGHTS_AND_CAPS.weight;
    let bedWeight;

    if (
      this.numberOfBedrooms <
      BED_WEIGHTS_AND_CAPS.numberOfBedrooms[
        BED_WEIGHTS_AND_CAPS.numberOfBedrooms.length - 1
      ]
    ) {
      // assign the weight based on the number of beds
      bedWeight = BED_WEIGHTS_AND_CAPS.weight[this.numberOfBedrooms];
    } else {
      // assign the last value if out of scale
      bedWeight = BED_WEIGHTS_AND_CAPS.weight[bedWeights.length - 1];
    }

    bedWeight = parseFloat(
      (bedWeight * this.averageMarketPrice).toFixed(PRECISION)
    );

    return bedWeight;
  }
}
