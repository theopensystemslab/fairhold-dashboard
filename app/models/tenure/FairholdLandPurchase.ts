import { Fairhold } from "../Fairhold";
import { Mortgage } from "../Mortgage";
import { ForecastParameters } from '../ForecastParameters'; 

interface FairholdLandPurchaseParams {
  newBuildPrice: number;
  depreciatedBuildPrice: number;
  affordability: number;
  fairhold: Fairhold;
  forecastParameters: ForecastParameters;
}

export class FairholdLandPurchase {
  params: FairholdLandPurchaseParams;
  discountedLandPrice: number;
  discountedLandMortgage: Mortgage;
  depreciatedHouseMortgage: Mortgage;

  constructor(params: FairholdLandPurchaseParams) {
    this.params = params;
    this.discountedLandPrice = params.fairhold.discountedLandPriceOrRent;

    this.discountedLandMortgage = new Mortgage({
      propertyValue: this.discountedLandPrice,
    });

    this.depreciatedHouseMortgage = new Mortgage({
      propertyValue: params.depreciatedBuildPrice,
    });
  }

}
