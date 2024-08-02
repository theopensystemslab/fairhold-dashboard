import { Fairhold } from "../Fairhold";
import { Mortgage } from "../Mortgage";

type Lifetime = {
  maintenanceCost: number;
  fairholdRentLand: number;
  houseMortgagePaymentYearly: number;
}[];

interface ConstructorParams {
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
}

export class FairholdLandRent {
  depreciatedHouseMortgage: Mortgage;
  discountedLandRentMonthly: number;
  lifetime: Lifetime;

  constructor(params: ConstructorParams) {
    this.depreciatedHouseMortgage = new Mortgage({
      propertyValue: params.depreciatedBuildPrice,
    });

    this.discountedLandRentMonthly = this.calculateDiscountedLandRentMonthly(params);
    this.lifetime = this.calculateLifetime(params);
  }

  private calculateDiscountedLandRentMonthly({ averageRentYearly, incomeYearly, landPrice, averagePrice }: ConstructorParams) {
    const landToTotalRatio = landPrice / averagePrice;
    const averageRentLandYearly = averageRentYearly * landToTotalRatio;
    const affordability = averageRentYearly / incomeYearly;

    const fairholdRentLand = new Fairhold({
      affordability: affordability,
      landPriceOrRent: averageRentLandYearly / 12,
    }).calculateDiscountedPriceOrRent();

    return fairholdRentLand;
  };

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
  }: ConstructorParams) {
    // initialize the variables that are going to be iterated
    let averagePriceIterative = averagePrice;
    let newBuildPriceIterative = newBuildPrice;
    let landPriceIterative = landPrice;
    let landToTotalRatioIterative = landPrice / averagePrice;
    let incomeIterative = incomeYearly;
    let averageRentYearlyIterative = averageRentYearly;
    let averageRentLandYearlyIterative =
      averageRentYearlyIterative * landToTotalRatioIterative;
    let maintenanceCostIterative =
      maintenanceCostPercentage * newBuildPriceIterative;

    let houseMortgagePaymentYearly = this.depreciatedHouseMortgage
      .yearlyPaymentBreakdown
    
    // find the first year
    let houseMortgagePaymentYearlyIterative =
      houseMortgagePaymentYearly[0].yearlyPayment;

    let lifetime: Lifetime = [
      {
        maintenanceCost: maintenanceCostIterative,
        fairholdRentLand: this.discountedLandRentMonthly,
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
      }).calculateDiscountedPriceOrRent();

      if (i < houseMortgagePaymentYearly.length - 1) {
        // find the first year
        houseMortgagePaymentYearlyIterative =
          houseMortgagePaymentYearly[i + 1].yearlyPayment;
      } else {
        houseMortgagePaymentYearlyIterative = 0;
      }

      lifetime.push({
        maintenanceCost: maintenanceCostIterative,
        fairholdRentLand: fairholdRentLandIterative,
        houseMortgagePaymentYearly: houseMortgagePaymentYearlyIterative,
      });
    }

    return lifetime;
  }
}
