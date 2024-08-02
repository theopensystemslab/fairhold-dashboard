import { WEEKS_PER_MONTH } from "../constants";
import { Property } from "../Property";

const NATIONAL_AVERAGE_RENT = 54.62;
// TODO: Check values with Ollie
const NATIONAL_AVERAGE_PROPERTY = 49750;
const NATIONAL_AVERAGE_EARNINGS = 316.4;

interface ConstructorParams {
  socialRentAverageEarning: number;
  // TODO: Replace 'any'
  socialRentAdjustments: any;
  housePriceIndex: number;
  property: Property;
}

export class SocialRent {
  public socialRentAverageEarning: number;
  public socialRentAdjustments: any;
  public housePriceIndex: number;
  public adjustedSocialRentMonthly: number;
  public socialRentMonthlyLand: number;
  public socialRentMonthlyHouse: number;
  public relativeLocalEarning: number;

  constructor(params: ConstructorParams) {
    this.socialRentAverageEarning = params.socialRentAverageEarning;
    this.socialRentAdjustments = params.socialRentAdjustments;
    this.housePriceIndex = params.housePriceIndex;
    this.relativeLocalEarning =
      params.socialRentAverageEarning / NATIONAL_AVERAGE_EARNINGS;

    const {
      adjustedSocialRentMonthly,
      socialRentMonthlyLand,
      socialRentMonthlyHouse,
    } = this.calculateSocialRent(params.property);

    this.adjustedSocialRentMonthly = adjustedSocialRentMonthly;
    this.socialRentMonthlyLand = socialRentMonthlyLand;
    this.socialRentMonthlyHouse = socialRentMonthlyHouse;
  }

  private calculateSocialRent({ numberOfBedrooms, landToTotalRatio }: Property) {
    // TODO: Could this be better expressed as an object?
    const beds = [0, 1, 2, 3, 4, 5, 6];
    const bedWeights = [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4];
    const socialRentCapValues = [
      155.73, 155.73, 164.87, 174.03, 183.18, 192.35, 201.5,
    ];

    let bedWeight;
    let rentCapWeekly;
    if (numberOfBedrooms < beds[beds.length - 1]) {
      bedWeight = bedWeights[numberOfBedrooms];
      rentCapWeekly = socialRentCapValues[numberOfBedrooms];
    } else {
      // assign the last value if out of scale
      bedWeight = bedWeights[bedWeights.length - 1];
      // assign the last value if out of scale
      rentCapWeekly = socialRentCapValues[bedWeights.length - 1];
    }

    const relativePropertyValue =
      this.housePriceIndex / NATIONAL_AVERAGE_PROPERTY;

    // TODO: Magic numbers - what are 0.7 and 0.3?
    let adjustedRentWeekly =
      0.7 * NATIONAL_AVERAGE_RENT * this.relativeLocalEarning * bedWeight +
      0.3 * NATIONAL_AVERAGE_RENT * relativePropertyValue;

    const secondToLastYear = this.socialRentAdjustments.length - 2;

    for (let i = 0; i < secondToLastYear; i++) {
      const adjustment = this.socialRentAdjustments[i];
      const adjustmentFactor = adjustment.total / 100 + 1;
      adjustedRentWeekly *= adjustmentFactor;
    }

    let socialRentWeekly;
    if (adjustedRentWeekly < rentCapWeekly) {
      socialRentWeekly = adjustedRentWeekly;
    } else {
      socialRentWeekly = rentCapWeekly;
    }

    const adjustedSocialRentMonthly = socialRentWeekly * WEEKS_PER_MONTH;
    const socialRentMonthlyLand = adjustedSocialRentMonthly * landToTotalRatio; 
    const socialRentMonthlyHouse = adjustedSocialRentMonthly - this.socialRentMonthlyLand; 

    return {
      adjustedSocialRentMonthly,
      socialRentMonthlyLand,
      socialRentMonthlyHouse,
    };
  }
}
