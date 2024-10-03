import { WEEKS_PER_MONTH } from "../constants";
import { BED_WEIGHTS_AND_CAPS, NATIONAL_AVERAGES } from "../constants";
import { socialRentAdjustmentTypes } from "../../data/socialRentAdjustmentsRepo";

/** These parameters are the necessary inputs for calculating the social rent formula. 
 * They include `numberOfBedrooms` (for weighting the property size and checking against rent caps),
 * `countyAverageEarnings1999` for calculating relative earnings, 
 * inflation data for adjusting social rent upwards in `socialRentAdjustments`, 
 * `hpi2000` with local property prices (TODO: fix to 1999),
 * and `landToTotalRatio` for estimating a split between land and house within monthly housing costs.
 */
interface SocialRentParams {
  /** Formula rent specifies different weightings and rent caps depending on the number of bedrooms in a dwelling. */
  numberOfBedrooms: number;
  countyAverageEarnings1999: number; 
  socialRentAdjustments: socialRentAdjustmentTypes;
  hpi2000: number;
  /** Using market values, calculates the ratio between land value and total value of a property. Used to estimate social rent land-house split. */
  landToTotalRatio: number;
}

export class SocialRent {
  /** Relative earnings in 1999 are calculated using the county average as an input. */
  countyAverageEarnings1999: number;
  /** An object that includes inflation and additional adjustments (by percentage) for uprating formula rent from 2000 values.  */
  socialRentAdjustments;
  /** Relative property prices are calculated using 1999 values; our current HPI data goes back as far as 2000 so that is used for now. */ // TODO: rename once data is updated.
  hpi2000;
  /** This is weekly formula rent multiplied by 4.2 for a full month and adjusted for inflation (from the 1999 figures) as well as for bedroom size. */
  adjustedSocialRentMonthly: number; 
  /** Using `landToTotalRatio`, estimates how much of monthly social rent goes towards land. */
  socialRentMonthlyLand: number;
  /** Using `landToTotalRatio`, estimates how much of monthly social rent goes towards the house. */
  socialRentMonthlyHouse: number;
  constructor(params: SocialRentParams) {
    this.countyAverageEarnings1999 = params.countyAverageEarnings1999;
    this.socialRentAdjustments = params.socialRentAdjustments;
    this.hpi2000 = params.hpi2000;
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

    const nationalAverageRent = NATIONAL_AVERAGES.rentWeekly;
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
      this.hpi2000 / nationalAverageMarketPrice1999; // relative property value

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
