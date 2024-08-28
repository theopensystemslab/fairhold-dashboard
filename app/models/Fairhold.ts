import * as math from "mathjs";

const DEFAULT_AMPLITUDE = 0.25;
const DEFAULT_LENGTH = 1;
const DEFAULT_POSITION = 0.45;
const DEFAULT_PLATEAU = 0.15;
const DEFAULT_THRESHOLD = 0.5;

type ConstructorParams = Pick<Fairhold, "affordability" | "landPriceOrRent"> &
  Partial<
    Pick<
      Fairhold,
      "amplitude" | "length" | "position" | "plateau" | "threshold"
    >
  >;

export class Fairhold {
  public affordability: number;
  public landPriceOrRent: number;
  public amplitude: number;
  public length: number;
  public position: number;
  public plateau: number;
  public threshold: number;
  public discountLand: number;
  public discountedLandPriceOrRent: number;

  constructor(params: ConstructorParams) {
    this.affordability = params.affordability;
    this.landPriceOrRent = params.landPriceOrRent;
    this.amplitude = params.amplitude || DEFAULT_AMPLITUDE;
    this.length = params.length || DEFAULT_LENGTH;
    this.position = params.position || DEFAULT_POSITION;
    this.plateau = params.plateau || DEFAULT_PLATEAU;
    this.threshold = params.threshold || DEFAULT_THRESHOLD;
    this.discountLand = this.calculateFairholdDiscount();
    this.discountedLandPriceOrRent = this.calculateDiscountedPriceOrRent();
  }

  private calculateFairholdDiscount() {
    if (this.affordability > this.threshold) return this.plateau;

    const discountLand =
      this.amplitude *
        math.cos((2 * math.pi * this.affordability) / this.length) +
      this.position;

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
