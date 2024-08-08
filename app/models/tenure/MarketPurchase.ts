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

type Lifetime = {
  maintenanceCost: number;
  landMortgagePaymentYearly: number;
  houseMortgagePaymentYearly: number;
}[];

export class MarketPurchase {
  public affordability: number;
  public houseMortgage: Mortgage;
  public landMortgage: Mortgage;
  public lifetime: Lifetime;

  constructor(params: ConstructorParams) {
    this.houseMortgage = new Mortgage({
      propertyValue: params.newBuildPrice,
    });

    this.landMortgage = new Mortgage({
      propertyValue: params.landPrice,
    });

    this.affordability = this.calculateAffordability(params);
    this.lifetime = this.calculateLifetime(params);
  }

  private calculateAffordability({ incomeYearly }: ConstructorParams) {
    const affordability =
      (this.landMortgage.monthlyPayment * MONTHS_PER_YEAR +
        this.houseMortgage.monthlyPayment * MONTHS_PER_YEAR) /
      incomeYearly;
    return affordability;
  }

  private calculateLifetime({
    newBuildPrice,
    maintenanceCostPercentage,
    yearsForecast,
    constructionPriceGrowthPerYear,
  }: ConstructorParams) {
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
