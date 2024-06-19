// import useful libraries
import * as math from "mathjs";

//define the fairhold object
export class Fairhold {
  affordability;
  originalLandPrice;
  housePrice;
  amplitude;
  length;
  position;
  plateau;
  threshold;
  discountLand?: number;
  discountedLandPrice?: number;
  totalHouseAndLandPrice?: number;
  constructor({
    affordability,
    originalLandPrice,
    housePrice,
    amplitude = 0.25,
    length = 1,
    position = 0.45,
    plateau = 0.15,
    threshold = 0.5,
  }: {
    affordability: number;
    originalLandPrice: number;
    housePrice: number;
    amplitude?: number;
    length?: number;
    position?: number;
    plateau?: number;
    threshold?: number;
  }) {
    this.affordability = affordability; // affordability index
    this.originalLandPrice = originalLandPrice; // price before the discountLand
    this.housePrice = housePrice; // House price
    this.amplitude = amplitude; // Amplitude in the fairhold formula
    this.length = length; // length in the fairhold formula
    this.position = position; // position in the fairhold formula
    this.plateau = plateau; // plateau in the fairhold formula
    this.threshold = threshold; // thersold in the fairhold formula
    this.calculateFairholdDiscount(); // calculate the fairhold discountLand
    this.calculateDiscountedPrice(); // calculate discounted price
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

  calculateDiscountedPrice() {
    if (this.discountLand == undefined) {
      throw new Error("discountLand is not defined");
    }

    if (this.originalLandPrice < 0) {
      this.discountedLandPrice = 1; // set a nominal value : check with Ollie
    } else {
      this.discountedLandPrice = this.discountLand * this.originalLandPrice;
    }
    this.totalHouseAndLandPrice = this.discountedLandPrice + this.housePrice; // set the total price
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

    if (this.depreciatedBuildPrice == undefined) {
      throw new Error("depreciatedBuildPrice is undefined");
    }

    return this.depreciatedBuildPrice;
  }

  // calculate the average property price based on the  number of bedrooms
  calculateBedWeightedAveragePrice(
    numberOfBeds: number = this.numberOfBedrooms,
    beds: number[] = [0, 1, 2, 3, 4, 5, 6],
    bedWeights: number[] = [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4],
    precisionRounding: number = 2
  ) {
    let bedWeight; // initialize the variable

    if (numberOfBeds < beds[beds.length - 1]) {
      bedWeight = bedWeights[numberOfBeds]; // assign the weight based on the number of beds
    } else {
      bedWeight = bedWeights[bedWeights.length - 1]; // assign the last value if out of scale
    }

    if (bedWeight == undefined) {
      throw new Error("bedWeight is undefined.");
    }

    return (this.bedWeightedAveragePrice = parseFloat(
      (bedWeight * this.averagePrice).toFixed(precisionRounding)
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
  socialRentAveEarning; // average social rent
  socialRentAdjustments; //rent adjustment values
  housePriceIndex; // house price index
  property; // property object
  averageRentLand?: number; // average rent for the land
  averageRentHouse?: number; // aveage rent for the house
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
  mortgageFairholdPurchase?: Mortgage;
  fairholdRent?: Fairhold;
  relativePropertyValue?: number;

  constructor({
    incomePerPerson,
    averageRent,
    socialRentAveEarning,
    socialRentAdjustments,
    housePriceIndex,
    property,
  }: {
    incomePerPerson: number;
    averageRent: number;
    socialRentAveEarning: number;
    socialRentAdjustments: any;
    housePriceIndex: number;
    property: Property;
  }) {
    this.incomePerPerson = incomePerPerson;
    this.averageRent = averageRent;
    this.socialRentAveEarning = socialRentAveEarning;
    this.socialRentAdjustments = socialRentAdjustments;
    this.housePriceIndex = housePriceIndex;
    this.property = property;
    this.calculateAverageRentLandAndHouse();
    this.calculateSocialRent();
    this.calculateHouseholdIncome();
    this.calculateMortgageValues();
    this.calculateFairholdValues();
  }

  calculateAverageRentLandAndHouse() {
    if (this.property.landToTotalRatio == undefined)
      throw new Error("landToTotalRatio is undefined");
    this.averageRentLand = this.averageRent * this.property.landToTotalRatio; // set the avearage rent for the land
    this.averageRentHouse = this.averageRent - this.averageRentLand; // set the avearage rent for the house
  }
  calculateSocialRent(
    numberOfBeds: number = this.property.numberOfBedrooms,
    beds: number[] = [0, 1, 2, 3, 4, 5, 6],
    bedWeights: number[] = [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4],
    /*     rentCapValues: number[] = [
      155.73, 155.73, 164.87, 174.03, 183.18, 192.35, 201.5,
    ], */
    precisionRounding: number = 2,
    nationalAverageRent: number = 54.62, // national average rent :check with Ollie
    nationalAverageProperty: number = 49750, // national average property value: check with Ollie
    nationalaverageEarnings: number = 316.4 // check with Ollie
  ) {
    let bedWeight; // initialize the bedWeight variable
    //let rentCapWeekly; // initiliaze the rent Cap values
    if (numberOfBeds < beds[beds.length - 1]) {
      bedWeight = bedWeights[numberOfBeds]; // assign the weight based on the number of beds
      //rentCapWeekly = rentCapValues[numberOfBeds]; // assign the rent cap value based on the number of beds
    } else {
      bedWeight = bedWeights[bedWeights.length - 1]; // assign the last value if out of scale
      //rentCapWeekly = rentCapValues[bedWeights.length - 1]; // assign the last value if out of scale
    }

    const relativeLocalEarning =
      this.socialRentAveEarning / nationalaverageEarnings; // realtivve local earnings
    this.relativeLocalEarning = relativeLocalEarning;
    const relativePropertyValue =
      this.housePriceIndex / nationalAverageProperty; // realtive property value
    this.relativePropertyValue = relativePropertyValue;
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
      this.property.landPrice == undefined ||
      this.averageRentLand == undefined
    )
      throw new Error(
        "either mortgageMarketAffordability or rentAffordability or property.landPrice or averageRentLand are undefined"
      );

    if (this.property.depreciatedBuildPrice == undefined)
      throw new Error("depreciatedBuildPrice is undefined");
    this.fairholdPurchase = new Fairhold({
      affordability: this.mortgageMarketAffordability,
      originalLandPrice: this.property.landPrice,
      housePrice: this.property.depreciatedBuildPrice,
    }); // create the fairhold object for purchase

    if (this.fairholdPurchase.totalHouseAndLandPrice == undefined)
      throw new Error("fairholdPurchase.discountedLandPrice is undefined");
    this.mortgageFairholdPurchase = new Mortgage({
      propertyValue: this.fairholdPurchase.totalHouseAndLandPrice,
    });

    this.mortgageDepreciatedHouse = new Mortgage({
      propertyValue: this.property.depreciatedBuildPrice,
    }); // mortgage calculated on the depreciated house price

    if (this.mortgageDepreciatedHouse.monthlyPayment == undefined)
      throw new Error("mortgageDepreciatedHouse.monthlyPayment is undefined");
    this.fairholdRent = new Fairhold({
      affordability: this.rentAffordability,
      originalLandPrice: this.averageRentLand,
      housePrice: this.mortgageDepreciatedHouse.monthlyPayment,
    }); // create the fairhold object for rent
  }
}
