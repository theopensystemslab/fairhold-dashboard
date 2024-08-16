import { Fairhold } from "../Fairhold";
import { Mortgage } from "../Mortgage";
import { ForecastParameters } from '../ForecastParameters'; 
interface FairholdLandPurchaseParams {
  newBuildPrice: number;
  depreciatedBuildPrice: number;
  affordability: number;
  fairhold: Fairhold;
  forecastParameters: ForecastParameters;
}

type Lifetime = {
  maintenanceCost: number;
  landMortgagePaymentYearly: number;
  houseMortgagePaymentYearly: number;
}[];

export class FairholdLandPurchase {
  params: FairholdLandPurchaseParams;
  discountedLandPrice: number;
  discountedLandMortgage: Mortgage;
  depreciatedHouseMortgage: Mortgage;
  lifetime: Lifetime;

  constructor(params: FairholdLandPurchaseParams) {
    this.params = params;
    this.discountedLandPrice = params.fairhold.discountedLandPriceOrRent;

    this.discountedLandMortgage = new Mortgage({
      propertyValue: this.discountedLandPrice,
    });

    this.depreciatedHouseMortgage = new Mortgage({
      propertyValue: params.depreciatedBuildPrice,
    });

    this.lifetime = this.calculateLifetime();
  }

  private calculateLifetime() {
      const {
        newBuildPrice,
        forecastParameters: {
          maintenanceCostPercentage,
          yearsForecast,
          constructionPriceGrowthPerYear,
        },
      } = this.params;
    let newBuildPriceIterative = newBuildPrice;
    let maintenanceCostIterative = maintenanceCostPercentage * newBuildPrice;

    const houseMortgagePaymentYearly =
      this.depreciatedHouseMortgage.yearlyPaymentBreakdown;

    // find the first year
    let houseMortgagePaymentYearlyIterative =
      houseMortgagePaymentYearly[0].yearlyPayment;

    const landMortgagePaymentYearly =
      this.discountedLandMortgage.yearlyPaymentBreakdown;

    // find the first year
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
      // calculate the new build price at a given year
      newBuildPriceIterative =
        newBuildPriceIterative * (1 + constructionPriceGrowthPerYear);
      // set the current maintenance cost
      maintenanceCostIterative =
        newBuildPriceIterative * maintenanceCostPercentage;

      if (i < houseMortgagePaymentYearly.length - 1) {
        // find the first year
        houseMortgagePaymentYearlyIterative =
          houseMortgagePaymentYearly[i + 1].yearlyPayment;
        // find the first year
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
