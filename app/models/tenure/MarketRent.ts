import { MONTHS_PER_YEAR } from "../constants";
import { ForecastParameters,  DEFAULT_FORECAST_PARAMETERS } from '../ForecastParameters'; 

interface MarketRentParams {
  averageRentYearly: number;
  averagePrice: number;
  newBuildPrice: number;
  depreciatedBuildPrice: number;
  landPrice: number;
  incomeYearly: number;
  forecastParameters: ForecastParameters;
}

type Lifetime = {
  averageRentLandYearly: number;
  averageRentHouseYearly: number;
}[];

export class MarketRent {
  params: MarketRentParams;
  public affordability: number;
  public averageRentMonthly: number;
  public averageRentLandMonthly: number;
  public averageRentHouseMonthly: number;
  public lifetime: Lifetime;

  constructor(params: MarketRentParams) {
    this.params = params;
    this.params.forecastParameters = {
      ...DEFAULT_FORECAST_PARAMETERS,
      ...params.forecastParameters
    };
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

    this.lifetime = this.calculateLifetime();
  }

  private calculateAverageRentLandAndHouse({
    landPrice,
    averagePrice,
    incomeYearly,
    averageRentYearly,
  }: MarketRentParams) {
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

  private calculateLifetime() {
    const { 
      averagePrice,
      newBuildPrice,
      landPrice,
      averageRentYearly,
      forecastParameters: {
        yearsForecast,
        propertyPriceGrowthPerYear,
        constructionPriceGrowthPerYear,
        rentGrowthPerYear,
      },
    } = this.params;

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
