// import useful libraries
import * as math from "mathjs";

//define the fairhold object
export class Fairhold {
  amplitude;
  length;
  position;
  plateau;
  threshold;
  constructor(
    amplitude: number = 0.25,
    length: number = 1,
    position: number = 0.45,
    plateau: number = 0.15,
    threshold: number = 0.5
  ) {
    this.amplitude = amplitude; // Amplitude in the fairhold formula
    this.length = length; // length in the fairhold formula
    this.position = position; // position in the fairhold formula
    this.plateau = plateau; // plateau in the fairhold formula
    this.threshold = threshold; // thersold in the fairhold formula
  }
}

// define the house class
export class House {
  postcode; // postcode of the house
  hType; // type of the house: D--> detached, S--> semidetached, T--> Terrace, F--> Flats
  numberOfBedrooms; // number of bedrooms in the house
  age; // age of the house
  size; // size of the house in meter squares
  buildPricePerMetre: number; // average build price per meter of a new property
  newBuildPrice?: number; // price of the house if it was new
  depreciatedBuildPrice?: number; // price of the house according to the depreciation regression
  constructor(
    postcode: string,
    hType: string,
    numberOfBedrooms: number,
    age: number,
    size: number,
    buildPricePerMetre: number
  ) {
    this.postcode = postcode;
    this.hType = hType;
    this.numberOfBedrooms = numberOfBedrooms;
    this.age = age;
    this.size = size;
    this.buildPricePerMetre = buildPricePerMetre;
    this.getNewBuildPriceAndDepreciatedBuildPrice(); // calculate new building price and teh depraciated building price
  }

  // calculate new building price and teh depraciated building price
  getNewBuildPriceAndDepreciatedBuildPrice(
    depreciationFactor: number = -32938,
    precisionRounding: number = 2
  ) {
    if (this.buildPricePerMetre) {
      const newBuildPrice = this.buildPricePerMetre * this.size; // caclualte the price of the new build
      this.newBuildPrice = parseFloat(newBuildPrice.toFixed(precisionRounding)); // round the number
      const depreciatedBuildPrice =
        this.newBuildPrice + depreciationFactor + math.log(this.age); // depreciated building price
      this.depreciatedBuildPrice = parseFloat(
        depreciatedBuildPrice.toFixed(precisionRounding)
      ); // round the number

      return [this.newBuildPrice, this.depreciatedBuildPrice];
    } else {
      throw new Error(
        "The house prices cannot be calculated because pricePerMeter has not been set"
      );
    }
  }
}

// define the mortgage class
export class Mortgage {
  houseValue: number; //value of the house
  interestRate: number; // interest rate of the mortgage in percentage e.r, 0.05=5%
  termOfTheMortgage: number; // number of years of the mortgage
  initialDeposit: number; // initial deposit of the value of the mortgage in percentage e.g. 0.15 =15% deposit
  amountOfTheMortgage?: number; // amount of the morgage requested
  monthlyPayment?: number; // monthly rate of the mortgage
  constructor(
    houseValue: number,
    interestRate: number = 0.06,
    termOfTheMortgage: number = 30,
    initialDeposit: number = 0.15
  ) {
    this.houseValue = houseValue;
    this.initialDeposit = initialDeposit;
    this.interestRate = interestRate;
    this.termOfTheMortgage = termOfTheMortgage;
    this.calculateamountOfTheMortgage(); // calculate the amount of the mortgage
    this.calculateMonthlyMortgagePayment(); // calculate the montly payment
  }

  calculateamountOfTheMortgage() {
    this.amountOfTheMortgage = this.houseValue * (1 - this.initialDeposit); // calculate the amount of the mortgage by removing the deposit
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

// set the weights for the bedroom
