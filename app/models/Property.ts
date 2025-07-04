import { MAINTENANCE_LEVELS, HOUSE_BREAKDOWN_PERCENTAGES, MaintenanceLevel, PROPERTY_PRICE_WEIGHTS, HOUSE_SIZE_MAPPINGS } from "./constants";
import { houseBreakdownType } from "./constants";
import { DepreciatedHouseBreakdownType } from "./Lifetime";
/**
 * Number of decimal places to use when rounding numerical values
 */
const PRECISION = 2;

export type PropertyParams = Pick<
  Property,
  | "postcode"
  | "houseType"
  | "numberOfBedrooms"
  | "age"
  | "maintenanceLevel"
  | "newBuildPricePerMetre"
  | "averageMarketPrice"
  | "itl3"
>;

export const HOUSE_TYPES = ["D", "S", "T", "F"] as const;

export type HouseType = (typeof HOUSE_TYPES)[number];

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
   * Size of the house in square meters
   */
  size: number;
  /**
   * The maintenance level sets graph options (eg for resale value), not the initial depreciated house price (default low)
   */
  maintenanceLevel: MaintenanceLevel;
  /**
   * Average build price per metre of a new house
   */
  newBuildPricePerMetre: number;
  averageMarketPrice: number;
  itl3: string;
  /**
   *  Price of the house if it was new, used for residual land value calculations
   * and for valuing the house alone in marketPurchase
   */
  newBuildPrice: number;
  /**
   * Since Fairhold treats homes as consumer durables, we need to depreciate homes over time.
   * The calculations use our custom depreciation method
   */
  depreciatedBuildPrice: number;
  depreciatedHouseBreakdown: DepreciatedHouseBreakdownType;
  landPrice: number;
  /**
   * This shows the % of the market price that land accounts for (`land value / market value`)
   * Used to break other rental tenure costs into land vs house
   */
  landToTotalRatio: number;

  constructor(params: PropertyParams) {
    this.postcode = params.postcode;
    this.houseType = params.houseType;
    this.numberOfBedrooms = params.numberOfBedrooms;
    this.age = params.age // TODO: update frontend so that newbuild = 0
    this.maintenanceLevel = params.maintenanceLevel;
    this.newBuildPricePerMetre = params.newBuildPricePerMetre;
    this.itl3 = params.itl3;
    this.depreciatedHouseBreakdown = {} as DepreciatedHouseBreakdownType

    // Computed properties, order is significant
    this.size = this.assignHouseSize(params.numberOfBedrooms);
    this.averageMarketPrice = this.weightAverageMarketPrice(params);
    this.newBuildPrice = this.calculateNewBuildPrice();
    this.depreciatedBuildPrice = this.calculateDepreciatedBuildPrice();
    this.landPrice = this.averageMarketPrice - this.newBuildPrice;
    this.landToTotalRatio = this.landPrice / this.averageMarketPrice;
  }

  private assignHouseSize(numberOfBedrooms: number) {
    const size = numberOfBedrooms > 6 ? 135 : HOUSE_SIZE_MAPPINGS[numberOfBedrooms];
    return size;
  }

  private weightAverageMarketPrice(params: PropertyParams) {
    const weightedAverageMarketPrice = params.averageMarketPrice * PROPERTY_PRICE_WEIGHTS[this.houseType][this.numberOfBedrooms]
    return weightedAverageMarketPrice
  }

  private calculateNewBuildPrice() {
    let newBuildPrice = this.newBuildPricePerMetre * this.size;
    newBuildPrice = parseFloat(newBuildPrice.toFixed(PRECISION));
    return newBuildPrice;
  }

  public calculateDepreciatedBuildPrice() {

    // Initialise depreciatedBuildPrice; since we need the house breakdown even for a newbuild (to store and iterate on it in Lifetime), we run calculateComponentValue instead of just assigning depreciatedHousePrice = newBuildPrice
    let depreciatedBuildPrice = 0;

    // Calculate for each component using the public method
    for (const key of Object.keys(HOUSE_BREAKDOWN_PERCENTAGES) as (keyof houseBreakdownType)[]) {
      const result = this.calculateComponentValue(
        key, 
        this.newBuildPrice, 
        this.age
      );

      depreciatedBuildPrice += result.depreciatedComponentValue;
    }
      depreciatedBuildPrice = parseFloat(depreciatedBuildPrice.toFixed(PRECISION))
    return depreciatedBuildPrice;
}

  public calculateComponentValue(
    componentKey: keyof houseBreakdownType,
    newBuildPrice: number,
    age: number
  ): ComponentCalculation {
    const maintenancePercentage = MAINTENANCE_LEVELS["low"] // `calculateDepreciatedBuildPrice` is only used in `Property` and not in `Lifetime`, so we can use the default value for maintenanceLevel

    const component = HOUSE_BREAKDOWN_PERCENTAGES[componentKey];
    
    /** Not 'new' as in updated, but 'new' as in if component was brand new (age 0) */
    const newComponentValue = newBuildPrice * component.percentageOfHouse;
    
    // Calculate depreciation
    const depreciationFactor = 1 - (component.depreciationPercentageYearly * age);
    
    // Calculate maintenance (0 for foundations and structure)
    const maintenanceAddition = 
        maintenancePercentage * newBuildPrice * age * component.percentOfMaintenanceYearly;
    
    // Calculate final value
    let depreciatedComponentValue = 
      (newComponentValue * depreciationFactor) + maintenanceAddition;

    depreciatedComponentValue < 0 ? depreciatedComponentValue = 0 : depreciatedComponentValue
    this.depreciatedHouseBreakdown[componentKey] = depreciatedComponentValue
    return {
      newComponentValue,
      depreciationFactor,
      maintenanceAddition,
      depreciatedComponentValue
    };
  }
}
