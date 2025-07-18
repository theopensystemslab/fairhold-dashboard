import { WEEKS_PER_MONTH } from "../constants";
import { BED_WEIGHTS_AND_CAPS, NATIONAL_AVERAGES } from "../constants";
import { socialRentAdjustmentTypes } from "@data/socialRentAdjustmentsRepo";

interface SocialRentParams {
  numberOfBedrooms: number;
  socialRentAverageEarning: number;
  socialRentAdjustments: socialRentAdjustmentTypes;
  housePriceIndex: number;
  landToTotalRatio: number;
}

export class SocialRent {
  /** It might look like smurf naming but we used this to avoid confusion with other average income figures */
  socialRentAverageEarning: number;
  /** adjustment factors that take into account the increase of living cost  */
  socialRentAdjustments;
  housePriceIndex;
  adjustedSocialRentMonthly: number; 
  socialRentMonthlyLand: number; 
  socialRentMonthlyHouse: number; 
  constructor(params: SocialRentParams) {
    this.socialRentAverageEarning = params.socialRentAverageEarning;
    this.socialRentAdjustments = params.socialRentAdjustments;
    this.housePriceIndex = params.housePriceIndex;
    const {
      adjustedSocialRentMonthly,
      socialRentMonthlyLand,
      socialRentMonthlyHouse,
    } = this.calculateSocialRent(params);
    this.adjustedSocialRentMonthly = adjustedSocialRentMonthly;
    this.socialRentMonthlyLand = socialRentMonthlyLand;
    this.socialRentMonthlyHouse = socialRentMonthlyHouse;
  }

  private calculateSocialRent(params: SocialRentParams) {
    let bedWeight; // initialize the bedWeight variable
    let rentCapWeekly; // initialize the rent cap values
    const SocialRentBedWeightsAndCaps = BED_WEIGHTS_AND_CAPS;
    const numberOfBedrooms = params.numberOfBedrooms;

    const nationalAverageRent = NATIONAL_AVERAGES.socialRentWeekly;
    const nationalAverageProperty = NATIONAL_AVERAGES.propertyValue;
    const nationalAverageEarnings = NATIONAL_AVERAGES.earningsWeekly;

    if (numberOfBedrooms < SocialRentBedWeightsAndCaps.numberOfBedrooms.length - 1) {
      bedWeight = SocialRentBedWeightsAndCaps.weight[numberOfBedrooms]; // find the weight corresponding to the number of beds
      rentCapWeekly = SocialRentBedWeightsAndCaps.socialRentCap[numberOfBedrooms]; // assign the rent cap value based on the number of beds
    } else {
      bedWeight = SocialRentBedWeightsAndCaps.weight[SocialRentBedWeightsAndCaps.weight.length - 1]; // assign the last value if out of scale
      rentCapWeekly =
        SocialRentBedWeightsAndCaps.socialRentCap[
          SocialRentBedWeightsAndCaps.socialRentCap.length - 1
        ]; // assign the last value if out of scale
    }

    const relativeLocalEarning =
      this.socialRentAverageEarning / nationalAverageEarnings; // relative local earnings

    const relativePropertyValue =
      this.housePriceIndex / nationalAverageProperty; // relative property value

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
      adjustedSocialRentMonthly - socialRentMonthlyLand; // set the rent value paid or the house
    return {
      adjustedSocialRentMonthly,
      socialRentMonthlyLand,
      socialRentMonthlyHouse,
    };
  }
}
