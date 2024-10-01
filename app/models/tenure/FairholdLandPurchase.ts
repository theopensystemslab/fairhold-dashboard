import { Fairhold } from "../Fairhold";
import { Mortgage } from "../Mortgage";

interface FairholdLandPurchaseParams {
  newBuildPrice: number;
  depreciatedBuildPrice: number;
  consumerPriceGrowthPerYear: number;
  yearsForecast: number;
  maintenanceCostPercentage: number;
  incomeGrowthPerYear: number;
  affordability: number;
  fairhold: Fairhold;
}

export class FairholdLandPurchase {
  discountedLandPrice: number;
  discountedLandMortgage: Mortgage;
  depreciatedHouseMortgage: Mortgage;

  constructor(params: FairholdLandPurchaseParams) {
    this.discountedLandPrice = params.fairhold.discountedLandPriceOrRent;

    this.discountedLandMortgage = new Mortgage({
      propertyValue: this.discountedLandPrice,
    });

    this.depreciatedHouseMortgage = new Mortgage({
      propertyValue: params.depreciatedBuildPrice,
    });
  }

}
