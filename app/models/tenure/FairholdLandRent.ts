import { Fairhold } from "../Fairhold";
import { Mortgage } from "../Mortgage";

export class FairholdLandRent {
  depreciatedHouseMortgage?: Mortgage; // mortgage on the depreciated house
  discountedLandRentMonthly?: number; // discounted land rent
  lifetime?: {
    maintenanceCost: number;
    fairholdRentLand: number;
    houseMortgagePaymentYearly: number;
  }[]; // lifetime object with projections
  constructor({
    averageRentYearly, // average rent per year
    averagePrice, // average price of the property
    newBuildPrice, // new build price of the property
    depreciatedBuildPrice, // depreciated building price
    landPrice, // land price
    incomeYearly, // yearly income per household
    propertyPriceGrowthPerYear, // 5% per year
    constructionPriceGrowthPerYear, // 2.5% per year
    yearsForecast, // 40 years
    maintenanceCostPercentage,
    incomeGrowthPerYear, // 4% per year income growth
    rentGrowthPerYear, // rent growth per year
  }: {
    averageRentYearly: number;
    averagePrice: number;
    newBuildPrice: number;
    depreciatedBuildPrice: number;
    landPrice: number;
    incomeYearly: number;
    affordabilityThresholdIncomePercentage: number;
    propertyPriceGrowthPerYear: number;
    constructionPriceGrowthPerYear: number;
    yearsForecast: number;
    maintenanceCostPercentage: number;
    incomeGrowthPerYear: number;
    rentGrowthPerYear: number;
    fairhold: Fairhold;
  }) {
    this.calculateMortgage(depreciatedBuildPrice);
    this.calculateLifetime(
      averagePrice,
      newBuildPrice,
      landPrice,
      incomeYearly,
      averageRentYearly,
      yearsForecast,
      propertyPriceGrowthPerYear,
      constructionPriceGrowthPerYear,
      incomeGrowthPerYear,
      rentGrowthPerYear,
      maintenanceCostPercentage
    );
  }

  calculateMortgage(depreciatedBuildPrice: number) {
    this.depreciatedHouseMortgage = new Mortgage({
      propertyValue: depreciatedBuildPrice,
    });
  }

  calculateLifetime(
    averagePrice: number,
    newBuildPrice: number,
    landPrice: number,
    incomeYearly: number,
    averageRentYearly: number,
    yearsForecast: number,
    propertyPriceGrowthPerYear: number,
    constructionPriceGrowthPerYear: number,
    incomeGrowthPerYear: number,
    rentGrowthPerYear: number,
    maintenanceCostPercentage: number
  ) {
    // initialize the variables that are going to be iterated
    let averagePriceIterative = averagePrice;
    let newBuildPriceIterative = newBuildPrice;
    let landPriceIterative = landPrice;
    let landToTotalRatioIterative = landPrice / averagePrice;
    let incomeIterative = incomeYearly; // set the current income
    let averageRentYearlyIterative = averageRentYearly; // yearly rent
    let averageRentLandYearlyIterative =
      averageRentYearlyIterative * landToTotalRatioIterative; // yearly rent for land
    let affordabilityIterative = averageRentYearlyIterative / incomeIterative; // affordability
    let maintenanceCostIterative =
      maintenanceCostPercentage * newBuildPriceIterative;

    let fairholdRentLandIterative = new Fairhold({
      affordability: affordabilityIterative,
      landPriceOrRent: averageRentLandYearlyIterative / 12,
    }).calculateDiscountedPriceOrRent(); // calculate the discounted land rent
    this.discountedLandRentMonthly = fairholdRentLandIterative;

    interface mortgageBreakdownTypes {
      yearlyPayment: number;
      cumulativePaid: number;
      remainingBalance: number;
    }

    if (
      this.depreciatedHouseMortgage === undefined ||
      this.depreciatedHouseMortgage.yearlyPaymentBreakdown === undefined
    ) {
      throw new Error("depreciatedHouseMortgage is undefined");
    }

    const houseMortgagePaymentYearly = this.depreciatedHouseMortgage
      .yearlyPaymentBreakdown as mortgageBreakdownTypes[];
    let houseMortgagePaymentYearlyIterative =
      houseMortgagePaymentYearly[0].yearlyPayment; // find the first year

    interface lifetimeTypes {
      maintenanceCost: number;
      fairholdRentLand: number;
      houseMortgagePaymentYearly: number;
    }

    let lifetime: lifetimeTypes[] = [
      {
        maintenanceCost: maintenanceCostIterative,
        fairholdRentLand: fairholdRentLandIterative,
        houseMortgagePaymentYearly: houseMortgagePaymentYearlyIterative,
      },
    ]; // initialize the forecast

    for (let i = 0; i < yearsForecast - 1; i++) {
      averagePriceIterative =
        averagePriceIterative * (1 + propertyPriceGrowthPerYear); // calculate the average price at a given year
      newBuildPriceIterative =
        newBuildPriceIterative * (1 + constructionPriceGrowthPerYear); // calculate the new build price at a given year
      landPriceIterative = averagePriceIterative - newBuildPriceIterative; // calculate the land price at agiven year
      landToTotalRatioIterative = landPriceIterative / averagePriceIterative; // calculate the land to total ratio
      incomeIterative = incomeIterative * (1 + incomeGrowthPerYear); // calculate the current income
      maintenanceCostIterative =
        maintenanceCostPercentage * newBuildPriceIterative; // calculate the curretn maintenance cost

      averageRentYearlyIterative =
        averageRentYearlyIterative * (1 + rentGrowthPerYear); // calculate the current rent

      averageRentLandYearlyIterative =
        averageRentYearlyIterative * landToTotalRatioIterative; // yearly rent for land

      let affordabilityIterative = averageRentYearlyIterative / incomeIterative; // affordability

      let fairholdRentLandIterative = new Fairhold({
        affordability: affordabilityIterative,
        landPriceOrRent: averageRentLandYearlyIterative,
      }).calculateDiscountedPriceOrRent(); // calculate the discounted land rent

      if (i < houseMortgagePaymentYearly.length - 1) {
        houseMortgagePaymentYearlyIterative =
          houseMortgagePaymentYearly[i + 1].yearlyPayment; // find the first year
      } else {
        houseMortgagePaymentYearlyIterative = 0;
      }

      lifetime.push({
        maintenanceCost: maintenanceCostIterative,
        fairholdRentLand: fairholdRentLandIterative,
        houseMortgagePaymentYearly: houseMortgagePaymentYearlyIterative,
      }); // add the current price to the new build price forecast
    }
    this.lifetime = lifetime; // save the object
  }
}
