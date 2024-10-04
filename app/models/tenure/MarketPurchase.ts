import { Mortgage } from "../Mortgage";
import { MONTHS_PER_YEAR } from "../constants";
import { ForecastParameters, DEFAULT_FORECAST_PARAMETERS } from '../ForecastParameters'; 

interface MarketPurchaseParams {
  averagePrice: number;
  newBuildPrice: number;
  depreciatedBuildPrice: number;
  landPrice: number;
  incomeYearly: number;
  forecastParameters: ForecastParameters;
}

export class MarketPurchase {
  params: MarketPurchaseParams;
  public affordability: number;
  public houseMortgage: Mortgage;
  public landMortgage: Mortgage;

  constructor(params: MarketPurchaseParams) {
    this.params = params;
    this.params.forecastParameters = {
      ...DEFAULT_FORECAST_PARAMETERS,
      ...params.forecastParameters
    };
    this.houseMortgage = new Mortgage({
      propertyValue: params.newBuildPrice,
    });

    this.landMortgage = new Mortgage({
      propertyValue: params.landPrice,
    });

    this.affordability = this.calculateAffordability(params);
  }

  private calculateAffordability({ incomeYearly }: MarketPurchaseParams) {
    const affordability =
      (this.landMortgage.monthlyPayment * MONTHS_PER_YEAR +
        this.houseMortgage.monthlyPayment * MONTHS_PER_YEAR) /
      incomeYearly;
    return affordability;
  }

}
