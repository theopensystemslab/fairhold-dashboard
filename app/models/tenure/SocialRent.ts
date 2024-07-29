import { WEEKS_PER_MONTH } from "../constants";
import {
  BED_WEIGHTS_AND_CAPS,
  bedWeightsAndCapsType,
  NATIONAL_AVERAGE_PARAMETRS,
} from "../constants";

interface SocialRentParams {
  numberOfBedrooms: number;
  socialRentAverageEarning: number;
  socialRentAdjustments: socialRentAdjustmentTypes;
  housePriceIndex: number;
  landToTotalRatio: number;
  bedWeightsAndCaps: bedWeightsAndCapsType;
  nationalAverageRent: number;
  nationalAveragePropertyValue: number;
  nationalAverageEarnings: number;
}

type socialRentAdjustmentTypes = {
  year: string;
  inflation: string;
  additional: string;
  total: string;
};

export class SocialRent {
  socialRentAverageEarning: number;
  /** adjustment factors that take into account the increase of living cost  */
  socialRentAdjustments;
  housePriceIndex;
  adjustedSocialRentMonthly: number; //adjusted social rent monthly
  socialRentMonthlyLand: number; // social rent to pay the land
  socialRentMonthlyHouse: number; // social rent monthly House
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
    this.socialRentMonthlyHouse = socialRentMonthlyHouse;
    this.socialRentMonthlyLand = socialRentMonthlyLand;
  }

  private calculateSocialRent(params: SocialRentParams) {
    let bedWeight; // initialize the bedWeight variable
    let rentCapWeekly; // initialize the rent Cap values
    const bedWeightsAndCaps = params.bedWeightsAndCaps || BED_WEIGHTS_AND_CAPS;
    const numberOfBedrooms = params.numberOfBedrooms;

    const nationalAverageRent =
      params.nationalAverageRent || NATIONAL_AVERAGE_PARAMETRS.socialRentWeekly;
    const nationalAverageProperty =
      params.nationalAveragePropertyValue ||
      NATIONAL_AVERAGE_PARAMETRS.propertyValue;
    const nationalAverageEarnings =
      params.nationalAverageEarnings ||
      NATIONAL_AVERAGE_PARAMETRS.earningsWeekly;

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
      this.socialRentAverageEarning / nationalAverageEarnings; // relative local earnings

    const relativePropertyValue =
      this.housePriceIndex / nationalAverageProperty; // relative property value

    const formulaRentWeekly =
      0.7 * nationalAverageRent * relativeLocalEarning * bedWeight +
      0.3 * nationalAverageRent * relativePropertyValue;

    let adjustedRentWeekly = formulaRentWeekly; // Initialize the adjusted rent weekly
    // Loop through each rent adjustment up to the second to last year

    for (let i = 0; i < params.socialRentAdjustments.total.length - 2; i++) {
      const adjustmentFactor =
        Number(params.socialRentAdjustments.total[i]) / 100 + 1; // Calculate the adjustment factor
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
