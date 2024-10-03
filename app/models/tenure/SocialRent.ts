import { WEEKS_PER_MONTH } from "../constants";
import { BED_WEIGHTS_AND_CAPS, NATIONAL_AVERAGES } from "../constants";
import { socialRentAdjustmentTypes } from "../../data/socialRentAdjustmentsRepo";

/** Here are the variables (non-constant) needed to calculate social rent */
interface SocialRentParams {
  numberOfBedrooms: number;
  countyAverageEarnings1999: number; 
  /** An object that includes inflation and additional adjustments (by percentage) for uprating formula rent from 2000 values  */
  socialRentAdjustments: socialRentAdjustmentTypes;
  averageMarketPrice2000: number;
  landToTotalRatio: number;
}

export class SocialRent {
  countyAverageEarnings1999: number;
  socialRentAdjustments;
  averageMarketPrice2000;
  adjustedSocialRentMonthly: number; //adjusted social rent monthly
  socialRentMonthlyLand: number; // social rent to pay the land
  socialRentMonthlyHouse: number; // social rent monthly House
  constructor(params: SocialRentParams) {
    this.countyAverageEarnings1999 = params.countyAverageEarnings1999;
    this.socialRentAdjustments = params.socialRentAdjustments;
    this.averageMarketPrice2000 = params.averageMarketPrice2000;
    const {
      adjustedSocialRentMonthly,
      socialRentMonthlyLand,
      socialRentMonthlyHouse,
    } = this.calculateSocialRent(params);
    this.adjustedSocialRentMonthly = adjustedSocialRentMonthly;
    this.socialRentMonthlyHouse = socialRentMonthlyHouse;
    this.socialRentMonthlyLand = socialRentMonthlyLand;
  }

  private calculateSocialRent(params: SocialRentParams) {
    let bedWeight; // initialize the bedWeight variable
    let rentCapWeekly; // initialize the rent Cap values
    const bedWeightsAndCaps = BED_WEIGHTS_AND_CAPS;
    const numberOfBedrooms = params.numberOfBedrooms;

    const nationalAverageRent = NATIONAL_AVERAGES.averageRentWeekly;
    const nationalAverageMarketPrice1999 = NATIONAL_AVERAGES.propertyValue;
    const nationalAverageEarnings1999 = NATIONAL_AVERAGES.earningsWeekly;

    if (numberOfBedrooms < bedWeightsAndCaps.numberOfBedrooms.length - 1) {
      bedWeight = bedWeightsAndCaps.weight[numberOfBedrooms]; // find the weight corresponding to the number of beds
      rentCapWeekly = bedWeightsAndCaps.socialRentCap[numberOfBedrooms]; // assign the rent cap value based on the number of beds
    } else {
      bedWeight = bedWeightsAndCaps.weight[bedWeightsAndCaps.weight.length - 1]; // assign the last value if out of scale
      rentCapWeekly =
        bedWeightsAndCaps.socialRentCap[
          bedWeightsAndCaps.socialRentCap.length - 1
        ]; // assign the last value if out of scale
    }

    const relativeLocalEarning =
      this.countyAverageEarnings1999 / nationalAverageEarnings1999; // relative local earnings

    const relativePropertyValue =
      this.averageMarketPrice2000 / nationalAverageMarketPrice1999; // relative property value; our local average market price is from 2000 because that's as far back as the HPI goes

    const formulaRentWeekly =
      0.7 * nationalAverageRent * relativeLocalEarning * bedWeight +
      0.3 * nationalAverageRent * relativePropertyValue;

    let adjustedRentWeekly = formulaRentWeekly; // Initialize the adjusted rent weekly
    // Loop through each rent adjustment up to the second to last year

    for (let i = 0; i < params.socialRentAdjustments.length - 2; i++) {
      const adjustmentFactor =
        Number(params.socialRentAdjustments[i].total) / 100 + 1; // Calculate the adjustment factor
      adjustedRentWeekly *= adjustmentFactor; // Apply the adjustment
    }

    let socialRentWeekly; // initialize the variable
    if (adjustedRentWeekly < rentCapWeekly) {
      socialRentWeekly = adjustedRentWeekly;
    } else {
      socialRentWeekly = rentCapWeekly;
    }

    const adjustedSocialRentMonthly = socialRentWeekly * WEEKS_PER_MONTH; // define the monthly social rent
    const socialRentMonthlyLand =
      adjustedSocialRentMonthly * params.landToTotalRatio; // set the rent value paid for the land
    const socialRentMonthlyHouse =
      adjustedSocialRentMonthly - this.socialRentMonthlyLand; // set the rent value paid or the house
    return {
      adjustedSocialRentMonthly,
      socialRentMonthlyLand,
      socialRentMonthlyHouse,
    };
  }
}
