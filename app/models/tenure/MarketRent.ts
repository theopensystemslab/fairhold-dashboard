import { MONTHS_PER_YEAR } from "../constants";

interface ConstructorParams {
  averageRentYearly: number;
  averagePrice: number;
  newBuildPrice: number;
  depreciatedBuildPrice: number;
  landPrice: number;
  incomeYearly: number;
  propertyPriceGrowthPerYear: number;
  constructionPriceGrowthPerYear: number;
  yearsForecast: number;
  maintenanceCostPercentage: number;
  rentGrowthPerYear: number;
}

type Lifetime = {
  averageRentLandYearly: number;
  averageRentHouseYearly: number;
}[];

export class MarketRent {
  public affordability: number;
  public averageRentMonthly: number;
  public averageRentLandMonthly: number;
  public averageRentHouseMonthly: number;
  public lifetime: Lifetime;

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

    this.lifetime = this.calculateLifetime(params);
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

  private calculateLifetime({
    averagePrice,
    newBuildPrice,
    landPrice,
    averageRentYearly,
    yearsForecast,
    propertyPriceGrowthPerYear,
    constructionPriceGrowthPerYear,
    rentGrowthPerYear,
  }: ConstructorParams) {
    // initialize the variables that are going to be iterated
    let averagePriceIterative = averagePrice;
    let newBuildPriceIterative = newBuildPrice;
    let landPriceIterative = landPrice;
    let landToTotalRatioIterative = landPrice / averagePrice;
    let averageRentYearlyIterative = averageRentYearly;
    let averageRentLandYearlyIterative =
      averageRentYearlyIterative * landToTotalRatioIterative;
    let averageRentHouseYearlyIterative =
      averageRentYearlyIterative - averageRentLandYearlyIterative;

    const lifetime: Lifetime = [
      {
        averageRentLandYearly: averageRentLandYearlyIterative,
        averageRentHouseYearly: averageRentHouseYearlyIterative,
      },
    ];

    for (let i = 0; i < yearsForecast - 1; i++) {
      averagePriceIterative =
        averagePriceIterative * (1 + propertyPriceGrowthPerYear);
      newBuildPriceIterative =
        newBuildPriceIterative * (1 + constructionPriceGrowthPerYear);
      landPriceIterative = averagePriceIterative - newBuildPriceIterative;
      landToTotalRatioIterative = landPriceIterative / averagePriceIterative;
      averageRentYearlyIterative =
        averageRentYearlyIterative * (1 + rentGrowthPerYear);
      averageRentLandYearlyIterative =
        averageRentYearlyIterative * landToTotalRatioIterative;
      averageRentHouseYearlyIterative =
        averageRentYearlyIterative - averageRentLandYearlyIterative;

      lifetime.push({
        averageRentLandYearly: averageRentLandYearlyIterative,
        averageRentHouseYearly: averageRentHouseYearlyIterative,
      });
    }

    return lifetime;
  }
}
