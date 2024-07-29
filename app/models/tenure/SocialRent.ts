import { Property } from "../Property";

export class SocialRent {
  socialRentAverageEarning; // average social rent
  socialRentAdjustments; //rent adjustment values
  housePriceIndex; // house price index
  //property; // preoperty information
  adjustedSocialRentMonthly?: number; //adjusted social rent monthly
  socialRentMonthlyLand?: number; // social rent to pay the land
  socialRentMonthlyHouse?: number; // social rent monthly House
  relativeLocalEarning?: number; // relative local earnings
  formulaRentWeekly?: number; // weekly rent
  constructor({
    socialRentAverageEarning,
    socialRentAdjustments,
    housePriceIndex,
    property,
  }: {
    socialRentAverageEarning: number;
    socialRentAdjustments: any;
    housePriceIndex: number;
    property: Property;
  }) {
    this.socialRentAverageEarning = socialRentAverageEarning;
    this.socialRentAdjustments = socialRentAdjustments;
    this.housePriceIndex = housePriceIndex;
    //this.property = property;
    this.calculateSocialRent(property);
  }

  calculateSocialRent(
    property: any,
    numberOfBeds: number = property.numberOfBedrooms,
    beds: number[] = [0, 1, 2, 3, 4, 5, 6],
    bedWeights: number[] = [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4],
    socialRentCapValues: number[] = [
      155.73, 155.73, 164.87, 174.03, 183.18, 192.35, 201.5,
    ],
    precisionRounding: number = 2,
    nationalAverageRent: number = 54.62, // national average rent :check with Ollie
    nationalAverageProperty: number = 49750, // national average property value: check with Ollie
    nationalAverageEarnings: number = 316.4 // check with Ollie
  ) {
    let bedWeight; // initialize the bedWeight variable
    let rentCapWeekly; // initialize the rent Cap values
    if (numberOfBeds < beds[beds.length - 1]) {
      bedWeight = bedWeights[numberOfBeds]; // assign the weight based on the number of beds
      rentCapWeekly = socialRentCapValues[numberOfBeds]; // assign the rent cap value based on the number of beds
    } else {
      bedWeight = bedWeights[bedWeights.length - 1]; // assign the last value if out of scale
      rentCapWeekly = socialRentCapValues[bedWeights.length - 1]; // assign the last value if out of scale
    }

    const relativeLocalEarning =
      this.socialRentAverageEarning / nationalAverageEarnings; // relative local earnings
    this.relativeLocalEarning = relativeLocalEarning;

    const relativePropertyValue =
      this.housePriceIndex / nationalAverageProperty; // relative property value

    const formulaRentWeekly =
      0.7 * nationalAverageRent * relativeLocalEarning * bedWeight +
      0.3 * nationalAverageRent * relativePropertyValue;
    this.formulaRentWeekly = formulaRentWeekly;

    let adjustedRentWeekly = formulaRentWeekly; // Initialize the adjusted rent weekly
    // Loop through each rent adjustment up to the second to last year
    if (this.socialRentAdjustments == undefined)
      throw new Error("socialRentAdjustments is undefined");

    for (let i = 0; i < this.socialRentAdjustments.length - 2; i++) {
      const adjustment = this.socialRentAdjustments[i]; // Get the current adjustment
      const adjustmentFactor = adjustment.total / 100 + 1; // Calculate the adjustment factor
      adjustedRentWeekly *= adjustmentFactor; // Apply the adjustment
    }

    let socialRentWeekly; // initialize the variable
    if (adjustedRentWeekly < rentCapWeekly) {
      socialRentWeekly = adjustedRentWeekly;
    } else {
      socialRentWeekly = rentCapWeekly;
    }

    const adjustedSocialRentMonthly = socialRentWeekly * 4.2; // define the monthly social rent

    this.adjustedSocialRentMonthly = adjustedSocialRentMonthly; // set the value of adjusted social rent monthly
    if (property.landToTotalRatio == undefined)
      throw new Error("landToTotalRatio is undefined");
    this.socialRentMonthlyLand =
      adjustedSocialRentMonthly * property.landToTotalRatio; // set the rent value paid for the land
    this.socialRentMonthlyHouse =
      adjustedSocialRentMonthly - this.socialRentMonthlyLand; // set the rent value paid or the house
  }
}
