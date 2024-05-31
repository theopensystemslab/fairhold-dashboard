// import useful libraries
import * as math from "mathjs";

//define the fairhold object
export class Fairhold {
  affordability;
  originalPrice;
  amplitude;
  length;
  position;
  plateau;
  threshold;
  discount?: number;
  discountedPrince?: number;
  constructor({
    affordability,
    originalPrice,
    amplitude = 0.25,
    length = 1,
    position = 0.45,
    plateau = 0.15,
    threshold = 0.5,
  }: {
    affordability: number;
    originalPrice: number;
    amplitude?: number;
    length?: number;
    position?: number;
    plateau?: number;
    threshold?: number;
  }) {
    this.affordability = affordability; // affordability index
    this.originalPrice = originalPrice; // price before the discount
    this.amplitude = amplitude; // Amplitude in the fairhold formula
    this.length = length; // length in the fairhold formula
    this.position = position; // position in the fairhold formula
    this.plateau = plateau; // plateau in the fairhold formula
    this.threshold = threshold; // thersold in the fairhold formula
    this.calculateFairholdDiscount(); // calculate the fairhold discount
    this.calculateDiscountedPrice(); // calculate discounted price
  }

  calculateFairholdDiscount() {
    if (this.affordability < this.threshold) {
      this.discount =
        this.amplitude *
          math.cos((2 * math.pi * this.affordability) / this.length) +
        this.position; // fairhold formula
    } else {
      this.discount = this.plateau; // fairhold formula
    }
  }

  calculateDiscountedPrice() {
    if (this.discount == undefined) {
      throw new Error("discount is not defined");
    }

    if (this.originalPrice < 0) {
      this.discountedPrince = 1; // set a nominal value : check with Ollie
    } else {
      this.discountedPrince = this.discount * this.originalPrice;
    }
  }
}

// define the property class
export class Property {
  postcode; // postcode of the property
  houseType; // type of the house: D--> detached, S--> semidetached, T--> Terrace, F--> Flats
  numberOfBedrooms; // number of bedrooms in the house
  age; // age of the house
  size; // size of the house in meter squares
  newBuildPricePerMetre: number; // average build price per meter of a new house
  averagePrice: number; // average market price
  itl3: string; // ITL code
  newBuildPrice?: number; // price of the house if it was new
  depreciatedBuildPrice?: number; // price of the house according to the depreciation regression
  bedWeightedAveragePrice?: number; // price of the house weigheted by the number of bedrooms
  landPrice?: number; // price of the land
  landToTotalRatio?: number; // ratio of the land price over the total

  constructor({
    postcode,
    houseType,
    numberOfBedrooms,
    age,
    size,
    newBuildPricePerMetre,
    averagePrice,
    itl3,
  }: {
    postcode: any;
    houseType: string;
    numberOfBedrooms: number;
    age: number;
    size: number;
    newBuildPricePerMetre: number;
    averagePrice: number;
    itl3: string;
  }) {
    this.postcode = postcode;
    this.houseType = houseType;
    this.numberOfBedrooms = numberOfBedrooms;
    this.age = age;
    this.size = size;
    this.newBuildPricePerMetre = newBuildPricePerMetre;
    this.averagePrice = averagePrice;
    this.itl3 = itl3;

    this.calculateNewBuildPrice(); // calculate new building price
    this.calculateDepreciatedBuildPrice(); // calculated the depreciated building price
    this.calculateBedWeightedAveragePrice(); // calculate the bed weighted building price
    this.calculateLandPrice(); // calculate the price of the land
    if (
      this.landPrice !== undefined &&
      this.bedWeightedAveragePrice !== undefined
    ) {
      this.landToTotalRatio = this.landPrice / this.bedWeightedAveragePrice; // define the land to total ratio
    }
  }

  // calculate new building price
  calculateNewBuildPrice(precisionRounding: number = 2) {
    if (!this.newBuildPricePerMetre) {
      throw new Error(
        "The Build Price cannot be calculated because pricePerMeter has not been set"
      );
    }
    const newBuildPrice = this.newBuildPricePerMetre * this.size; // calculate the price of the new build
    this.newBuildPrice = parseFloat(newBuildPrice.toFixed(precisionRounding)); // round the number

    return this.newBuildPrice;
  }

  // calculate nthe depraciated building price
  calculateDepreciatedBuildPrice(
    depreciationFactor: number = -32938,
    precisionRounding: number = 2
  ) {
    if (!this.newBuildPrice) {
      throw new Error(
        "The Depreciated Price cannot be calculated because newBuildPrice has not been set"
      );
    }

    const depreciatedBuildPrice =
      this.newBuildPrice + depreciationFactor * math.log(this.age); // depreciated building price
    this.depreciatedBuildPrice = parseFloat(
      depreciatedBuildPrice.toFixed(precisionRounding)
    ); // round the number

    return this.depreciatedBuildPrice;
  }

  // calculate the average property price based on the  number of bedrooms
  calculateBedWeightedAveragePrice(
    numberOfBeds: number = this.numberOfBedrooms,
    beds: number[] = [0, 1, 2, 3, 4, 5, 6],
    bedWeigths: number[] = [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4],
    precisionRounding: number = 2
  ) {
    let bedWeigth; // initialize the variable

    if (numberOfBeds < beds[beds.length - 1]) {
      bedWeigth = bedWeigths[numberOfBeds]; // assign the weight based on the number of beds
    } else {
      bedWeigth = bedWeigths[bedWeigths.length - 1]; // assign the last value if out of scale
    }

    if (bedWeigth == undefined) {
      throw new Error("bedWigth is undefined.");
    }

    return (this.bedWeightedAveragePrice = parseFloat(
      (bedWeigth * this.averagePrice).toFixed(precisionRounding)
    )); // calculate the bed weighted average price
  }
  calculateLandPrice() {
    if (this.newBuildPrice == undefined)
      throw new Error("newBuildPrice is undefined");
    return (this.landPrice = this.averagePrice - this.newBuildPrice); // calculate the price of the land
  }
}

// define the mortgage class
export class Mortgage {
  propertyValue: number; //value of the property for the mortgage
  interestRate: number; // interest rate of the mortgage in percentage e.r, 0.05=5%
  termOfTheMortgage: number; // number of years of the mortgage
  initialDeposit: number; // initial deposit of the value of the mortgage in percentage e.g. 0.15 =15% deposit
  amountOfTheMortgage?: number; // amount of the morgage requested
  monthlyPayment?: number; // monthly rate of the mortgage
  constructor({
    propertyValue,
    interestRate = 0.06,
    termOfTheMortgage = 30,
    initialDeposit = 0.15,
  }: {
    propertyValue: number;
    interestRate?: number;
    termOfTheMortgage?: number;
    initialDeposit?: number;
  }) {
    this.propertyValue = propertyValue;
    this.initialDeposit = initialDeposit;
    this.interestRate = interestRate;
    this.termOfTheMortgage = termOfTheMortgage;
    this.calculateamountOfTheMortgage(); // calculate the amount of the mortgage
    this.calculateMonthlyMortgagePayment(); // calculate the montly payment
  }

  calculateamountOfTheMortgage() {
    this.amountOfTheMortgage = this.propertyValue * (1 - this.initialDeposit); // calculate the amount of the mortgage by removing the deposit
    return this.amountOfTheMortgage;
  }

  calculateMonthlyMortgagePayment() {
    const monthlyInterestRate = this.interestRate / 12; // Convert annual interest rate to monthly rate
    const numberOfPayments = this.termOfTheMortgage * 12; // Convert term in years to total number of payments
    if (this.amountOfTheMortgage !== undefined) {
      const monthlyPayment =
        (this.amountOfTheMortgage *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1); // Calculate the monthly payment
      this.monthlyPayment = parseFloat(monthlyPayment.toFixed(2)); // Store monthly payment rounded to 2 decimal places in class property
      return this.monthlyPayment;
    } else {
      throw new Error("amountOfTheMortgage is undefined");
    }
  }
}

export class Household {
  incomePerPerson; // income per person
  averageRent; // average rent
  averageSocialRent; // average social rent
  rentAdjustements; //rent adjustment values
  housePriceIndex; // house price index
  property; // property object
  income?: number; // income per household
  adjustedSocialRentMonthly?: number; //adjusted social rent monthly
  socialRentMonthlyLand?: number; // social rent to pay the land
  socialRentMonthlyHouse?: number; // social rent monthly House
  relativeLocalEarning?: number;
  formulaRentWeekly?: number; // weekly rent
  mortgageMarket?: Mortgage;
  mortgageHouse?: Mortgage;
  mortgageDepreciatedHouse?: Mortgage;
  mortgageLand?: Mortgage;
  mortgageMarketAffordability?: number;
  rentAffordability?: number;
  fairholdPurchase?: Fairhold;
  fairholdRent?: Fairhold;
  relativePropertyValue?: number;

  constructor({
    incomePerPerson,
    averageRent,
    averageSocialRent,
    rentAdjustements,
    housePriceIndex,
    property,
  }: {
    incomePerPerson: number;
    averageRent: number;
    averageSocialRent: number;
    rentAdjustements: any;
    housePriceIndex: number;
    property: Property;
  }) {
    this.incomePerPerson = incomePerPerson;
    this.averageRent = averageRent;
    this.averageSocialRent = averageSocialRent;
    this.rentAdjustements = rentAdjustements;
    this.housePriceIndex = housePriceIndex;
    this.property = property;
    this.calculateSocialRent();
    this.calculateHouseholdIncome();
    this.calculateMortgageValues();
    this.calculateFairholdValues();
  }

  calculateSocialRent(
    numberOfBeds: number = this.property.numberOfBedrooms,
    beds: number[] = [0, 1, 2, 3, 4, 5, 6],
    bedWeigths: number[] = [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4],
    /*     rentCapValues: number[] = [
      155.73, 155.73, 164.87, 174.03, 183.18, 192.35, 201.5,
    ], */
    precisionRounding: number = 2,
    nationalAverageRent: number = 54.62, // national average rent :check with Ollie
    nationalAverageProperty: number = 49750, // national average property value: check with Ollie
    nationalaverageEarnings: number = 316.4 // check with Ollie
  ) {
    let bedWeigth; // initialize the bedWeigth variable
    //let rentCapWeekly; // initiliaze the rent Cap values
    if (numberOfBeds < beds[beds.length - 1]) {
      bedWeigth = bedWeigths[numberOfBeds]; // assign the weight based on the number of beds
      //rentCapWeekly = rentCapValues[numberOfBeds]; // assign the rent cap value based on the number of beds
    } else {
      bedWeigth = bedWeigths[bedWeigths.length - 1]; // assign the last value if out of scale
      //rentCapWeekly = rentCapValues[bedWeigths.length - 1]; // assign the last value if out of scale
    }

    const relativeLocalEarning =
      this.averageSocialRent / nationalaverageEarnings; // realtivve local earnings
    this.relativeLocalEarning = relativeLocalEarning;
    const relativePropertyValue =
      this.housePriceIndex / nationalAverageProperty; // realtive property value
    this.relativePropertyValue = relativePropertyValue;
    const formulaRentWeekly =
      0.7 * nationalAverageRent * relativeLocalEarning * bedWeigth +
      0.3 * nationalAverageRent * relativePropertyValue;
    this.formulaRentWeekly = formulaRentWeekly;
    let adjustedRentWeekly = formulaRentWeekly; // Initialize the adjusted rent weekly
    // Loop through each rent adjustment up to the second to last year
    for (let i = 0; i < this.rentAdjustements.length - 2; i++) {
      const adjustment = this.rentAdjustements[i]; // Get the current adjustment
      const adjustmentFactor = adjustment.total / 100 + 1; // Calculate the adjustment factor
      adjustedRentWeekly *= adjustmentFactor; // Apply the adjustment
    }
    /* 
    let socialRentWeekly; // initialize the variable
    if (adjustedRentWeekly < rentCapWeekly) {
      socialRentWeekly = adjustedRentWeekly;
    } else {
      socialRentWeekly = rentCapWeekly;
    } */

    const adjustedSocialRentMonthly = adjustedRentWeekly * 4.2; // define the monthly social rent
    this.adjustedSocialRentMonthly = adjustedSocialRentMonthly; // set the value of adjusted social rent monthly
    if (this.property.landToTotalRatio == undefined)
      throw new Error("landToTotalRatio is undefined");
    this.socialRentMonthlyLand =
      adjustedSocialRentMonthly * this.property.landToTotalRatio; // set the rent value paid for the land
    this.socialRentMonthlyHouse =
      adjustedSocialRentMonthly - this.socialRentMonthlyLand; // set the rent value paid or the house
  }
  calculateHouseholdIncome(houseMultiplier: number = 2.4) {
    this.income = houseMultiplier * this.incomePerPerson; // calculate the income for house hold
    this.rentAffordability = this.averageRent / (this.income / 12); // calculate the rent affordability
  }

  calculateMortgageValues() {
    this.mortgageMarket = new Mortgage({
      propertyValue: this.property.averagePrice,
    }); // create the mortgage object for the market value
    if (
      this.property.newBuildPrice == undefined ||
      this.property.depreciatedBuildPrice == undefined
    )
      throw new Error(
        "either newBuildPrice or depreciatedBuildPrice are undefined"
      );

    this.mortgageHouse = new Mortgage({
      propertyValue: this.property.newBuildPrice,
    }); // create the mortgage object for the new build price
    this.mortgageDepreciatedHouse = new Mortgage({
      propertyValue: this.property.depreciatedBuildPrice,
    }); // create the mortgage object for the depraciated build price
    this.mortgageLand = new Mortgage({
      propertyValue: this.property.averagePrice - this.property.newBuildPrice,
    }); // create the mortgage object for the land. Check with Ollie, shouldn't it be depreciated house?

    if (
      this.mortgageMarket.monthlyPayment == undefined ||
      this.income == undefined
    )
      throw new Error("either monthlyPayment or income undefined");

    this.mortgageMarketAffordability =
      this.mortgageMarket.monthlyPayment / (this.income / 12); // calculate the mortage market affordability
  }
  calculateFairholdValues() {
    if (
      this.mortgageMarketAffordability == undefined ||
      this.rentAffordability == undefined ||
      this.property.landPrice == undefined
    )
      throw new Error(
        "either mortgageMarketAffordability or rentAffordability or property.landPrice are undefined"
      );

    this.fairholdPurchase = new Fairhold({
      affordability: this.mortgageMarketAffordability,
      originalPrice: this.property.landPrice,
    }); // create the fairhold object for purchase
    this.fairholdRent = new Fairhold({
      affordability: this.rentAffordability,
      originalPrice: this.averageRent,
    }); // create the fairhold object for rent
  }
}
