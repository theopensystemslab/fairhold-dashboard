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

/** `FairholdLandPurchase` needs different params to FairholdLandRent,
 * which is why they are separate classes that both instantiate an instance of Fairhold. 
 * Where `FairholdLandRent` uses other classes (eg `MarketPurchase`, `ForecastParameters`), they are passed in*/
export class FairholdLandPurchase {
  params: FairholdLandPurchaseParams;
  discountedLandPrice: number;
  discountedLandMortgage: Mortgage;
  depreciatedHouseMortgage: Mortgage;
  /** All tenure classes have an `interestPaid` property, summed from `Mortgage.totalInterest` (if more than one `Mortgage` class) */
  interestPaid: number;
  /** Interest saved relative to `MarketPurchase`, pounds */
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
