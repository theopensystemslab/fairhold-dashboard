import { Fairhold } from "../Fairhold";
import { Mortgage } from "../Mortgage";

export class FairholdLandPurchase {
  discountedLandPrice?: number;
  discountedLandMortgage?: Mortgage;
  depreciatedHouseMortgage?: Mortgage;
  lifetime?: {
    maintenanceCost: number;
    landMortgagePaymentYearly: number;
    houseMortgagePaymentYearly: number;
  }[];
  constructor({
    newBuildPrice, // new build price of the property
    depreciatedBuildPrice, // depreciated building price
    constructionPriceGrowthPerYear, // construction price growth per year
    yearsForecast, // years forecast
    maintenanceCostPercentage, // maintenance cost percentage
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
    this.calculateFairholdDiscount(fairhold); // calculate the fairhold discountLand
    this.calculateMortgage(depreciatedBuildPrice); // calculate the mortgage
    this.calculateLifetime(
      newBuildPrice,
      maintenanceCostPercentage,
      yearsForecast,
      constructionPriceGrowthPerYear
    ); // calculate the lifetime
  }

  calculateFairholdDiscount(fairhold: Fairhold) {
    let discountedLandPrice = fairhold.calculateDiscountedPriceOrRent(); // calculate the discounted land price
    this.discountedLandPrice = discountedLandPrice; // discounted land price
  }

  calculateMortgage(depreciatedBuildPrice: number) {
    if (this.discountedLandPrice == undefined) {
      throw new Error("discountedLandPrice is not defined");
    }
    this.discountedLandMortgage = new Mortgage({
      propertyValue: this.discountedLandPrice,
    });

    this.depreciatedHouseMortgage = new Mortgage({
      propertyValue: depreciatedBuildPrice,
    });
  }

  calculateLifetime(
    newBuildPrice: number,
    maintenanceCostPercentage: number,
    yearsForecast: number,
    constructionPriceGrowthPerYear: number
  ) {
    let newBuildPriceIterative = newBuildPrice;
    let maintenanceCostIterative = maintenanceCostPercentage * newBuildPrice;
    // retrieve the mortgage payments for the first year
    if (
      this.depreciatedHouseMortgage === undefined ||
      this.depreciatedHouseMortgage.yearlyPaymentBreakdown === undefined
    ) {
      throw new Error("depreciatedHouseMortgage is undefined");
    }

    interface mortgageBreakdownTypes {
      yearlyPayment: number;
      cumulativePaid: number;
      remainingBalance: number;
    }
    const houseMortgagePaymentYearly = this.depreciatedHouseMortgage
      .yearlyPaymentBreakdown as mortgageBreakdownTypes[];
    let houseMortgagePaymentYearlyIterative =
      houseMortgagePaymentYearly[0].yearlyPayment; // find the first year

    if (
      this.discountedLandMortgage === undefined ||
      this.discountedLandMortgage.yearlyPaymentBreakdown === undefined
    ) {
      throw new Error("depreciatedHouseMortgage is undefined");
    }

    const landMortgagePaymentYearly = this.discountedLandMortgage
      .yearlyPaymentBreakdown as mortgageBreakdownTypes[];

    let landMortgagePaymentYearlyIterative =
      landMortgagePaymentYearly[0].yearlyPayment; // find the first year

    interface lifetimeTypes {
      maintenanceCost: number;
      landMortgagePaymentYearly: number;
      houseMortgagePaymentYearly: number;
    }

    let lifetime: lifetimeTypes[] = [
      {
        maintenanceCost: maintenanceCostIterative,
        landMortgagePaymentYearly: landMortgagePaymentYearlyIterative,
        houseMortgagePaymentYearly: houseMortgagePaymentYearlyIterative,
      },
    ]; // initialize the forecast
    for (let i = 0; i < yearsForecast - 1; i++) {
      newBuildPriceIterative =
        newBuildPriceIterative * (1 + constructionPriceGrowthPerYear); // calculate the new build price at a given year
      maintenanceCostIterative =
        newBuildPriceIterative * maintenanceCostPercentage; // set the current maintenance cost

      if (i < houseMortgagePaymentYearly.length - 1) {
        houseMortgagePaymentYearlyIterative =
          houseMortgagePaymentYearly[i + 1].yearlyPayment; // find the first year
        landMortgagePaymentYearlyIterative =
          landMortgagePaymentYearly[i + 1].yearlyPayment; // find the first year
      } else {
        houseMortgagePaymentYearlyIterative = 0;
        landMortgagePaymentYearlyIterative = 0;
      }

      lifetime.push({
        maintenanceCost: maintenanceCostIterative,
        landMortgagePaymentYearly: landMortgagePaymentYearlyIterative,
        houseMortgagePaymentYearly: houseMortgagePaymentYearlyIterative,
      }); // add the current price to the new build price forecast
    }
    this.lifetime = lifetime; // save the object
  }
}
