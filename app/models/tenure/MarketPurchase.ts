import { Mortgage } from "../Mortgage";
import { MONTHS_PER_YEAR } from "../constants";

interface ConstructorParams {
  averagePrice: number;
  newBuildPrice: number;
  depreciatedBuildPrice: number;
  landPrice: number;
  incomeYearly: number;
  propertyPriceGrowthPerYear: number;
  constructionPriceGrowthPerYear: number;
  yearsForecast: number;
  maintenanceCostPercentage: number;
}

export class MarketPurchase {
  public affordability: number;
  public houseMortgage: Mortgage;
  public landMortgage: Mortgage;

  constructor(params: ConstructorParams) {
    this.houseMortgage = new Mortgage({
      propertyValue: params.newBuildPrice,
    });

    this.landMortgage = new Mortgage({
      propertyValue: params.landPrice,
    });

    this.affordability = this.calculateAffordability(params);
  }

  private calculateAffordability({ incomeYearly }: ConstructorParams) {
    const affordability =
      (this.landMortgage.monthlyPayment * MONTHS_PER_YEAR +
        this.houseMortgage.monthlyPayment * MONTHS_PER_YEAR) /
      incomeYearly;
    return affordability;
  }

}
