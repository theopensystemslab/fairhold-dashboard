import * as math from "mathjs";

type ConstructorParams = Pick<Fairhold, "affordability" | "landPriceOrRent">;

export class Fairhold {
  public affordability: number;
  public landPriceOrRent: number;
  public discountLand: number;
  public discountedLandPriceOrRent: number;

  constructor(params: ConstructorParams) {
    this.affordability = params.affordability;
    this.landPriceOrRent = params.landPriceOrRent;
    this.discountLand = this.calculateFairholdDiscount();
    this.discountedLandPriceOrRent = this.calculateDiscountedPriceOrRent();
  }

  private calculateFairholdDiscount() {
    const discountLand = math.max(-1.1 * this.affordability + 0.7, 0.15)
    return discountLand;
  }

  private calculateDiscountedPriceOrRent() {
    if (this.landPriceOrRent < 0) {
      // TODO: Set a nominal value (Check with Ollie)
      const nominalLandPriceOrRent = 1;
      return nominalLandPriceOrRent;
    }

    const discountedLandPriceOrRent = this.discountLand * this.landPriceOrRent;
    return discountedLandPriceOrRent;
  }
}
