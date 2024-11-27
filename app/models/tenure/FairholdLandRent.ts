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

/** `FairholdLandRent` needs different params to `FairholdLandPurchase`,
 * which is why they are separate classes that both instantiate an instance of `Fairhold`. 
 * Where `FairholdLandRent` uses other classes (eg `MarketPurchase`, `ForecastParameters`), they are passed in*/
export class FairholdLandRent {
  params: FairholdLandRentParams;
  depreciatedHouseMortgage: Mortgage;
  discountedLandRentMonthly: number;
  /** All tenure classes have an `interestPaid` property, summed from `Mortgage.totalInterest` (if more than one `Mortgage` class) */
  interestPaid: number;
  /** Interest saved relative to `MarketPurchase`, pounds */
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
    /*TODO: landToTotalRatio is calculated elsewhere too, eg when instantiating socialRent in Property... 
    can we just calculate it once?*/
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
