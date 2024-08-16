import { MONTHS_PER_YEAR } from "../constants";
import { Mortgage } from "../Mortgage";
import { ForecastParameters, DEFAULT_FORECAST_PARAMETERS } from '../ForecastParameters'; 

interface MarketPurchaseParams {
  averagePrice: number;
  newBuildPrice: number;
  depreciatedBuildPrice: number;
  landPrice: number;
  incomeYearly: number;
  forecastParameters: ForecastParameters;
}

type Lifetime = {
  maintenanceCost: number;
  landMortgagePaymentYearly: number;
  houseMortgagePaymentYearly: number;
}[];

export class MarketPurchase {
  params: MarketPurchaseParams;
  public affordability: number;
  public houseMortgage: Mortgage;
  public landMortgage: Mortgage;
  public lifetime: Lifetime;

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
    this.lifetime = this.calculateLifetime();
  }

  private calculateAffordability({ incomeYearly }: MarketPurchaseParams) {
    const affordability =
      (this.landMortgage.monthlyPayment * MONTHS_PER_YEAR +
        this.houseMortgage.monthlyPayment * MONTHS_PER_YEAR) /
      incomeYearly;
    return affordability;
  }

  private calculateLifetime() {
    const {
      newBuildPrice,
      forecastParameters: {
        maintenanceCostPercentage,
        yearsForecast,
        constructionPriceGrowthPerYear
      },
    } = this.params;
  
    let newBuildPriceIterative = newBuildPrice;
    let maintenanceCostIterative = maintenanceCostPercentage * newBuildPrice;

    const houseMortgagePaymentYearly =
      this.houseMortgage.yearlyPaymentBreakdown;
    const landMortgagePaymentYearly = this.landMortgage.yearlyPaymentBreakdown;

    // Find the first year
    let houseMortgagePaymentYearlyIterative =
      houseMortgagePaymentYearly[0].yearlyPayment;
    let landMortgagePaymentYearlyIterative =
      landMortgagePaymentYearly[0].yearlyPayment;

    const lifetime: Lifetime = [
      {
        maintenanceCost: maintenanceCostIterative,
        landMortgagePaymentYearly: landMortgagePaymentYearlyIterative,
        houseMortgagePaymentYearly: houseMortgagePaymentYearlyIterative,
      },
    ];

    for (let i = 0; i < yearsForecast - 1; i++) {
      newBuildPriceIterative =
        newBuildPriceIterative * (1 + constructionPriceGrowthPerYear);
      maintenanceCostIterative =
        newBuildPriceIterative * maintenanceCostPercentage;

      if (i < houseMortgagePaymentYearly.length - 1) {
        // Find the first year
        houseMortgagePaymentYearlyIterative =
          houseMortgagePaymentYearly[i + 1].yearlyPayment;
        landMortgagePaymentYearlyIterative =
          landMortgagePaymentYearly[i + 1].yearlyPayment;
      } else {
        houseMortgagePaymentYearlyIterative = 0;
        landMortgagePaymentYearlyIterative = 0;
      }

      lifetime.push({
        maintenanceCost: maintenanceCostIterative,
        landMortgagePaymentYearly: landMortgagePaymentYearlyIterative,
        houseMortgagePaymentYearly: houseMortgagePaymentYearlyIterative,
      });
    }

    return lifetime;
  }
}
