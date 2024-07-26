import * as math from "mathjs";

export class Fairhold {
  affordability;
  landPriceOrRent;
  amplitude;
  length;
  position;
  plateau;
  threshold;
  discountLand?: number;
  discountedLandPriceOrRent?: number;
  constructor({
    affordability,
    landPriceOrRent,
    amplitude = 0.25,
    length = 1,
    position = 0.45,
    plateau = 0.15,
    threshold = 0.5,
  }: {
    affordability: number;
    landPriceOrRent: number;
    amplitude?: number;
    length?: number;
    position?: number;
    plateau?: number;
    threshold?: number;
  }) {
    this.affordability = affordability; // affordability index
    this.landPriceOrRent = landPriceOrRent; // price before the discountLand
    this.amplitude = amplitude; // Amplitude in the fairhold formula
    this.length = length; // length in the fairhold formula
    this.position = position; // position in the fairhold formula
    this.plateau = plateau; // plateau in the fairhold formula
    this.threshold = threshold; // thersold in the fairhold formula
    this.calculateFairholdDiscount(); // calculate the fairhold discountLand
  }

  calculateFairholdDiscount() {
    if (this.affordability < this.threshold) {
      this.discountLand =
        this.amplitude *
          math.cos((2 * math.pi * this.affordability) / this.length) +
        this.position; // fairhold formula
    } else {
      this.discountLand = this.plateau; // fairhold formula
    }
  }

  calculateDiscountedPriceOrRent() {
    if (this.discountLand == undefined) {
      throw new Error("discountLand is not defined");
    }
    let discountedLandPriceOrRent; // discounted land price
    if (this.landPriceOrRent < 0) {
      discountedLandPriceOrRent = 1;
      this.discountedLandPriceOrRent = discountedLandPriceOrRent; // set a nominal value : check with Ollie
    } else {
      discountedLandPriceOrRent = this.discountLand * this.landPriceOrRent;
      this.discountedLandPriceOrRent = discountedLandPriceOrRent;
    }
    return discountedLandPriceOrRent;
  }
}
