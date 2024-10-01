import { MONTHS_PER_YEAR } from "../constants";

interface ConstructorParams {
  averageRentYearly: number;
  averagePrice: number;
  newBuildPrice: number;
  depreciatedBuildPrice: number;
  landPrice: number;
  incomeYearly: number;
  propertyPriceGrowthPerYear: number;
  consumerPriceGrowthPerYear: number;
  yearsForecast: number;
  maintenanceCostPercentage: number;
  rentGrowthPerYear: number;
}

export class MarketRent {
  public affordability: number;
  public averageRentMonthly: number;
  public averageRentLandMonthly: number;
  public averageRentHouseMonthly: number;

  constructor(params: ConstructorParams) {
    const {
      averageRentMonthly,
      averageRentLandMonthly,
      averageRentHouseMonthly,
      affordability,
    } = this.calculateAverageRentLandAndHouse(params);

    this.averageRentMonthly = averageRentMonthly;
    this.averageRentLandMonthly = averageRentLandMonthly;
    this.averageRentHouseMonthly = averageRentHouseMonthly;
    this.affordability = affordability;
  }

  private calculateAverageRentLandAndHouse({
    landPrice,
    averagePrice,
    incomeYearly,
    averageRentYearly,
  }: ConstructorParams) {
    const averageRentMonthly = averageRentYearly / MONTHS_PER_YEAR;
    const landToTotalRatio = landPrice / averagePrice;
    const averageRentLandMonthly = averageRentMonthly * landToTotalRatio;
    const averageRentHouseMonthly = averageRentMonthly - averageRentLandMonthly;
    const affordability = averageRentYearly / incomeYearly;

    return {
      averageRentMonthly,
      averageRentLandMonthly,
      averageRentHouseMonthly,
      affordability,
    };
  }

}
