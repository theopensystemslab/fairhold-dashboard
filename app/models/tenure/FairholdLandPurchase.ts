import { Fairhold } from "../Fairhold";
import { Mortgage } from "../Mortgage";
import { ForecastParameters } from '../ForecastParameters'; 
import { MarketPurchase } from "./MarketPurchase";

interface FairholdLandPurchaseParams {
  newBuildPrice: number;
  depreciatedBuildPrice: number;
  affordability: number;
  fairhold: Fairhold;
  forecastParameters: ForecastParameters;
  marketPurchase: MarketPurchase;
}

export class FairholdLandPurchase {
  params: FairholdLandPurchaseParams;
  discountedLandPrice: number;
  discountedLandMortgage: Mortgage;
  depreciatedHouseMortgage: Mortgage;
  interestPaid: number;
  /** interest saved relative to market purchase, pounds */
  interestSaved: number;

  constructor(params: FairholdLandPurchaseParams) {
    this.params = params;
    this.discountedLandPrice = params.fairhold.discountedLandPriceOrRent;

    this.discountedLandMortgage = new Mortgage({
      propertyValue: this.discountedLandPrice,
    });

    this.depreciatedHouseMortgage = new Mortgage({
      propertyValue: params.depreciatedBuildPrice,
    });

    this.interestPaid = 
      this.calculateInterestPaid();

    this.interestSaved = 
      this.calculateInterestSaved(params.marketPurchase);
  }

  private calculateInterestPaid() {
    return this.depreciatedHouseMortgage.totalInterest + this.discountedLandMortgage.totalInterest;
  }

  private calculateInterestSaved(marketPurchase: MarketPurchase): number {
    return marketPurchase.interestPaid - this.interestPaid;
  }

}
