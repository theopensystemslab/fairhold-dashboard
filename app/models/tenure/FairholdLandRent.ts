import { MONTHS_PER_YEAR } from "../constants";
import { Fairhold } from "../Fairhold";
import { Mortgage } from "../Mortgage";

interface FairholdLandRentParams {
  averageRentYearly: number;
  averagePrice: number;
  newBuildPrice: number;
  depreciatedBuildPrice: number;
  landPrice: number;
  incomeYearly: number;
  affordabilityThresholdIncomePercentage: number;
  propertyPriceGrowthPerYear: number;
  consumerPriceGrowthPerYear: number;
  yearsForecast: number;
  maintenanceCostPercentage: number;
  incomeGrowthPerYear: number;
  rentGrowthPerYear: number;
  fairhold: Fairhold;
}

export class FairholdLandRent {
  /** Mortgage on the depreciated value of the house */
  depreciatedHouseMortgage: Mortgage;
  /** discounted value of the monthly land rent according to fairhold */
  discountedLandRentMonthly: number;

  constructor(params: FairholdLandRentParams) {
    this.depreciatedHouseMortgage = new Mortgage({
      propertyValue: params.depreciatedBuildPrice,
    });

    this.discountedLandRentMonthly =
      this.calculateDiscountedLandRentMonthly(params);
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
      fairholdLandRent.discountedLandPriceOrRent;

    return discountedLandRentMonthly;
  }
}
