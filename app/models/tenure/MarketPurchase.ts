import { Mortgage } from "../Mortgage";

export class MarketPurchase {
  affordability?: number; // affordability fo the market
  houseMortgage?: Mortgage; // mortgage object on the new house
  landMortgage?: Mortgage; // mortgage on the land
  lifetime?: {
    maintenanceCost: number;
    landMortgagePaymentYearly: number;
    houseMortgagePaymentYearly: number;
  }[]; // lifetime object with projections

  constructor({
    newBuildPrice, // new build price of the property
    landPrice, // land price
    incomeYearly, // income Yearly per household
    constructionPriceGrowthPerYear, // 2.5% per year
    yearsForecast, // 40 years
    maintenanceCostPercentage, // 1.5% percentage maintenance cost
  }: {
    averagePrice: number;
    newBuildPrice: number;
    depreciatedBuildPrice: number;
    landPrice: number;
    incomeYearly: number;
    propertyPriceGrowthPerYear: number;
    constructionPriceGrowthPerYear: number;
    yearsForecast: number;
    maintenanceCostPercentage: number;
  }) {
    this.calculateHouseMortgage(newBuildPrice);
    this.calculateLandMortgage(landPrice);
    this.calculateAffordability(incomeYearly);
    this.calculateLifetime(
      newBuildPrice,
      maintenanceCostPercentage,
      yearsForecast,
      constructionPriceGrowthPerYear
    );
  }

  calculateHouseMortgage(newBuildPrice: number) {
    this.houseMortgage = new Mortgage({
      propertyValue: newBuildPrice,
    });
  }
  calculateLandMortgage(landPrice: number) {
    this.landMortgage = new Mortgage({
      propertyValue: landPrice,
    });
  }

  calculateAffordability(incomeYearly: number) {
    if (
      this.landMortgage === undefined ||
      this.houseMortgage === undefined ||
      this.landMortgage.monthlyPayment === undefined ||
      this.houseMortgage.monthlyPayment === undefined
    ) {
      throw new Error("landMortgage or houseMortgage is undefined");
    }
    let affordability =
      (this.landMortgage?.monthlyPayment * 12 +
        this.houseMortgage?.monthlyPayment * 12) /
      incomeYearly;
    this.affordability = affordability;
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
      this.houseMortgage === undefined ||
      this.houseMortgage.yearlyPaymentBreakdown === undefined
    ) {
      throw new Error("houseMortgage is undefined");
    }

    if (
      this.landMortgage === undefined ||
      this.landMortgage.yearlyPaymentBreakdown === undefined
    ) {
      throw new Error("landMortgage is undefined");
    }
    interface mortgageBreakdownTypes {
      yearlyPayment: number;
      cumulativePaid: number;
      remainingBalance: number;
    }
    const houseMortgagePaymentYearly = this.houseMortgage
      .yearlyPaymentBreakdown as mortgageBreakdownTypes[];
    const landMortgagePaymentYearly = this.landMortgage
      .yearlyPaymentBreakdown as mortgageBreakdownTypes[];
    let houseMortgagePaymentYearlyIterative =
      houseMortgagePaymentYearly[0].yearlyPayment; // find the first year
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
