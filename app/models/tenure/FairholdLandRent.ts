import { MONTHS_PER_YEAR } from "../constants";
import { Fairhold } from "../Fairhold";
import { Mortgage } from "../Mortgage";
import { MONTHS_PER_YEAR } from "../constants";

interface FairholdLandRentParams {
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
}

type Lifetime = {
  maintenanceCost: number;
  fairholdRentLand: number;
  houseMortgagePaymentYearly: number;
}[];

export class FairholdLandRent {
  /** Mortgage on the depreaciated value of the house */
  depreciatedHouseMortgage: Mortgage;
  /** discounted value of the monthly land rent according to fairhold */
  discountedLandRentMonthly: number;
  /** lifetime projections of the tenure model */
  lifetime: Lifetime;

  constructor(params: FairholdLandRentParams) {
    this.depreciatedHouseMortgage = new Mortgage({
      propertyValue: params.depreciatedBuildPrice,
    });

    this.discountedLandRentMonthly =
      this.calculateDiscountedLandRentMonthly(params);
    this.lifetime = this.calculateLifetime(params);
  }

  private calculateDiscountedLandRentMonthly({
    incomeYearly,
    averageRentYearly,
    landPrice,
    averagePrice,
  }: FairholdLandRentParams) {
    const marketRentAffordability = incomeYearly / averageRentYearly;
    const landToTotalRatio = landPrice / averagePrice;
    const averageRentLandMonthly =
      (averageRentYearly / MONTHS_PER_YEAR) * landToTotalRatio;

    const fairholdLandRent = new Fairhold({
      affordability: marketRentAffordability,
      landPriceOrRent: averageRentLandMonthly,
    });
    const discountedLandRentMonthly =
      fairholdLandRent.calculateDiscountedPriceOrRent();

    return discountedLandRentMonthly;
  }
  private calculateLifetime({
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
    maintenanceCostPercentage,
  }: FairholdLandRentParams) {
    // initialize the variables that are going to be iterated
    let averagePriceIterative = averagePrice;
    let newBuildPriceIterative = newBuildPrice;
    let landPriceIterative = landPrice;
    let landToTotalRatioIterative = landPrice / averagePrice;
    let incomeIterative = incomeYearly;
    let averageRentYearlyIterative = averageRentYearly;
    let averageRentLandYearlyIterative =
      averageRentYearlyIterative * landToTotalRatioIterative;
    let affordabilityIterative = averageRentYearlyIterative / incomeIterative;
    let maintenanceCostIterative =
      maintenanceCostPercentage * newBuildPriceIterative;

    let fairholdRentLandIterative = new Fairhold({
      affordability: affordabilityIterative,
      landPriceOrRent: averageRentLandYearlyIterative / MONTHS_PER_YEAR,
    }).discountedLandPriceOrRent;
    this.discountedLandRentMonthly = fairholdRentLandIterative;

    const houseMortgagePaymentYearly =
      this.depreciatedHouseMortgage.yearlyPaymentBreakdown;
    let houseMortgagePaymentYearlyIterative =
      houseMortgagePaymentYearly[0].yearlyPayment; // find the first year

    let lifetime: Lifetime = [
      {
        maintenanceCost: maintenanceCostIterative,
        fairholdRentLand: fairholdRentLandIterative,
        houseMortgagePaymentYearly: houseMortgagePaymentYearlyIterative,
      },
    ];

    for (let i = 0; i < yearsForecast - 1; i++) {
      averagePriceIterative =
        averagePriceIterative * (1 + propertyPriceGrowthPerYear);
      newBuildPriceIterative =
        newBuildPriceIterative * (1 + constructionPriceGrowthPerYear);
      landPriceIterative = averagePriceIterative - newBuildPriceIterative;
      landToTotalRatioIterative = landPriceIterative / averagePriceIterative;
      incomeIterative = incomeIterative * (1 + incomeGrowthPerYear);
      maintenanceCostIterative =
        maintenanceCostPercentage * newBuildPriceIterative;

      averageRentYearlyIterative =
        averageRentYearlyIterative * (1 + rentGrowthPerYear);

      averageRentLandYearlyIterative =
        averageRentYearlyIterative * landToTotalRatioIterative;

      let affordabilityIterative = averageRentYearlyIterative / incomeIterative;

      let fairholdRentLandIterative = new Fairhold({
        affordability: affordabilityIterative,
        landPriceOrRent: averageRentLandYearlyIterative,
      }).discountedLandPriceOrRent;

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
    return lifetime; // save the object
  }
}
