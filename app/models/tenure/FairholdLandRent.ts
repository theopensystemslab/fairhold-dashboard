import { MONTHS_PER_YEAR } from "../constants";
import { Fairhold } from "../Fairhold";
import { Mortgage } from "../Mortgage";
import { ForecastParameters } from '../ForecastParameters'; 
import { MarketPurchase } from "./MarketPurchase";

interface FairholdLandRentParams {
  averageRentYearly: number;
  averagePrice: number;
  newBuildPrice: number;
  depreciatedBuildPrice: number;
  landPrice: number;
  incomeYearly: number;
  fairhold: Fairhold;
  forecastParameters: ForecastParameters;
  marketPurchase: MarketPurchase;
}

export class FairholdLandRent {
  params: FairholdLandRentParams;
  /** Mortgage on the depreciated value of the house */
  depreciatedHouseMortgage: Mortgage;
  /** discounted value of the monthly land rent according to fairhold */
  discountedLandRentMonthly: number;
  interestPaid: number;
  /** interest saved relative to market purchase, pounds */
  interestSaved: number;

  constructor(params: FairholdLandRentParams) {
    this.params = params;
    this.depreciatedHouseMortgage = new Mortgage({
      propertyValue: params.depreciatedBuildPrice,
    });

    this.discountedLandRentMonthly =
      this.calculateDiscountedLandRentMonthly(params);

    this.interestPaid = 
      this.calculateInterestPaid();

    this.interestSaved = 
      this.calculateInterestSaved(params.marketPurchase);
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

  private calculateInterestPaid() {
    return this.depreciatedHouseMortgage.totalInterest;
  }

  private calculateInterestSaved(marketPurchase: MarketPurchase): number {
    return marketPurchase.interestPaid - this.interestPaid;
  }
}
