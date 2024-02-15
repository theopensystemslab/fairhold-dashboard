// import useful libraries
import * as math from "mathjs";

//define the fairhold object
class fairhold {
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
    this.amplitude = amplitude;
    this.length = length;
    this.position = position;
    this.plateau = plateau;
    this.threshold = threshold;
  }
}

// define the house class
class House {
  postcode; // postcode of the house
  hType; // type of the house: D--> detached, S--> semidetached, T--> Terrace, F--> Flats
  numberOfBedrooms; // number of bedrooms in the house
  age; // age of the house
  size; // size of the house in meter squares
  buildPricePerMetre?: number; // average build price per meter of a new property
  newBuildPrice?: number; // price of the house if it was new
  depreciatedBuildPrice?: number; // price of the house according to the depreciation regression
  constructor(
    postcode: string,
    hType: string,
    numberOfBedrooms: number,
    age: number,
    size: number
  ) {
    this.postcode = postcode;
    this.hType = hType;
    this.numberOfBedrooms = numberOfBedrooms;
    this.age = age;
    this.size = size;
  }

  //fecth the medium price per meter according to the database
  fecthBuildPricePerMetre(pricePerMeter: number) {
    this.buildPricePerMetre = pricePerMeter; // set the price per meter
  }

  // calculate new building price and current building price
  getHousePrices(depreciationFactor: number = -32938) {
    if (this.buildPricePerMetre) {
      this.newBuildPrice = this.buildPricePerMetre * this.size; // caclualte the price of the new build
      this.depreciatedBuildPrice =
        this.newBuildPrice + depreciationFactor + math.log(this.age);
    } else {
      throw new Error(
        "The house prices cannot be calculated because pricePerMeter has not been set"
      );
    }
  }
}

// define the mortgage class
class Mortgage {
  amountOfTheMortgage: number; // amount of the morgage requested
  interestRate: number; // interest rate of the mortgage in percentage e.r, 0.05=5%
  termOfTheMortgage: number; // number of years of the mortgage
  monthlyPayment?: number; // monthly rate of the mortgage
  constructor(
    amountOfTheMortgage: number,
    interestRate: number,
    termOfTheMortgage: number
  ) {
    this.amountOfTheMortgage = amountOfTheMortgage;
    this.interestRate = interestRate;
    this.termOfTheMortgage = termOfTheMortgage;
  }
}
