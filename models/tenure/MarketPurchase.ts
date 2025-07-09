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

// TODO: decide on language to use (eg freeholdPurchase?)
export class MarketPurchase {
  params: MarketPurchaseParams;
  /** Uses the summed mortgages to calculate percentage of GDHI spent on housing monthly */
  public affordability: number;
  public houseMortgage: Mortgage;
  public landMortgage: Mortgage;
  /** All tenure classes have an `interestPaid` property, summed from `Mortgage.totalInterest` (if more than one Mortgage class) */
  public interestPaid: number;

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

    this.interestPaid = this.calculateInterestPaid();
  }

  private calculateAffordability({ incomeYearly }: MarketPurchaseParams) {
    const affordability =
      (this.landMortgage.monthlyPayment * MONTHS_PER_YEAR +
        this.houseMortgage.monthlyPayment * MONTHS_PER_YEAR) /
      incomeYearly;
    return affordability;
  }

  private calculateInterestPaid() {
    return this.houseMortgage.totalInterest + this.landMortgage.totalInterest
  }

}
