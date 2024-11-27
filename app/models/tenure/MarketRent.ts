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

export class MarketRent {
  params: MarketRentParams;
  public affordability: number;
  public averageRentMonthly: number;
  public averageRentLandMonthly: number;
  public averageRentHouseMonthly: number;

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
  }

  private calculateAverageRentLandAndHouse({
    landPrice,
    averagePrice,
    incomeYearly,
    averageRentYearly,
  }: MarketRentParams) {
    const averageRentMonthly = averageRentYearly / MONTHS_PER_YEAR;
    // TODO: landToTotalRatio is calculated multiple times in multiple places, can we just do it once?
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
