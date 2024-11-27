import * as math from "mathjs";

// Fairhold formula constants
const MULTIPLIER = -1.1
const OFFSET = 0.7
const PLATEAU = 0.15

type ConstructorParams = Pick<Fairhold, "affordability" | "landPriceOrRent">;

/** The Fairhold class is a generic class 
 * (meaning it will calculate a discount regardless if it is given a purchase price or monthly rent).
 * It is instantiated twice,
 * once each for `FairholdLandPurchase` and `FairholdLandRent`
 */
export class Fairhold {
  /** Affordability is calculated as monthly housing cost / GDHI */
  public affordability: number;
  /** Depending on whether calculating `FairholdLandPurchase` or `FairholdLandRent`,
   * pass the relevant figure (open market residual land value or estimated portion of monthly market rent
   * that goes towards location)
   */
  public landPriceOrRent: number;
  /** The Fairhold discount is a multiplier, so Fairhold prices are `discountLand * open market value`
   */
  public discountLand: number;
  /** When the class is instantiated for `FairholdLandPurchase`, this is the discounted up-front land purchase price;
   * when instantiated for `FairholdLandPurchase`, this is the discounted monthly community ground rent
  */
  public discountedLandPriceOrRent: number;

  constructor(params: ConstructorParams) {
    this.affordability = params.affordability;
    this.landPriceOrRent = params.landPriceOrRent;
    this.discountLand = this.calculateFairholdDiscount();
    this.discountedLandPriceOrRent = this.calculateDiscountedPriceOrRent();
  }

  /** Our formula is linear; the more expensive an area is, the lower the generated price multiplier is;
   * it plateaus at .15 of market rate
    */
  private calculateFairholdDiscount() {
    const discountLand = math.max(MULTIPLIER * this.affordability + OFFSET, PLATEAU)
    return discountLand;
  }

  /** Multiplies market land price or rent by the discountLand multiplier;
   * in the event that land values are effectively negative, land price will be £1
   */
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
