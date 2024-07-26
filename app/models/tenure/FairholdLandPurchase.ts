import { Fairhold } from "../Fairhold";
import { Mortgage } from "../Mortgage";

type Lifetime = {
  maintenanceCost: number;
  landMortgagePaymentYearly: number;
  houseMortgagePaymentYearly: number;
}[];

export class FairholdLandPurchase {
  discountedLandPrice: number;
  discountedLandMortgage: Mortgage;
  depreciatedHouseMortgage: Mortgage;
  lifetime: Lifetime;

  constructor({
    newBuildPrice,
    depreciatedBuildPrice,
    constructionPriceGrowthPerYear,
    yearsForecast,
    maintenanceCostPercentage,
    fairhold,
  }: {
    newBuildPrice: number;
    depreciatedBuildPrice: number;
    constructionPriceGrowthPerYear: number;
    yearsForecast: number;
    maintenanceCostPercentage: number;
    incomeGrowthPerYear: number;
    affordability: number;
    fairhold: Fairhold;
  }) {
    this.discountedLandPrice = fairhold.calculateDiscountedPriceOrRent();

    this.discountedLandMortgage = new Mortgage({
      propertyValue: this.discountedLandPrice,
    });

    this.depreciatedHouseMortgage = new Mortgage({
      propertyValue: depreciatedBuildPrice,
    });

    this.lifetime = this.calculateLifetime(
      newBuildPrice,
      maintenanceCostPercentage,
      yearsForecast,
      constructionPriceGrowthPerYear
    );
  }

  private calculateLifetime(
    newBuildPrice: number,
    maintenanceCostPercentage: number,
    yearsForecast: number,
    constructionPriceGrowthPerYear: number
  ) {
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

    let lifetime: Lifetime = [
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
