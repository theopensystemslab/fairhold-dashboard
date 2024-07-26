// import useful libraries
import * as math from "mathjs";

//define the fairhold object for Land Purchase
export class Fairhold {
  affordability;
  landPriceOrRent;
  amplitude;
  length;
  position;
  plateau;
  threshold;
  discountLand?: number;
  discountedLandPriceOrRent?: number;
  constructor({
    affordability,
    landPriceOrRent,
    amplitude = 0.25,
    length = 1,
    position = 0.45,
    plateau = 0.15,
    threshold = 0.5,
  }: {
    affordability: number;
    landPriceOrRent: number;
    amplitude?: number;
    length?: number;
    position?: number;
    plateau?: number;
    threshold?: number;
  }) {
    this.affordability = affordability; // affordability index
    this.landPriceOrRent = landPriceOrRent; // price before the discountLand
    this.amplitude = amplitude; // Amplitude in the fairhold formula
    this.length = length; // length in the fairhold formula
    this.position = position; // position in the fairhold formula
    this.plateau = plateau; // plateau in the fairhold formula
    this.threshold = threshold; // thersold in the fairhold formula
    this.calculateFairholdDiscount(); // calculate the fairhold discountLand
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

  calculateDiscountedPriceOrRent() {
    if (this.discountLand == undefined) {
      throw new Error("discountLand is not defined");
    }
    let discountedLandPriceOrRent; // discounted land price
    if (this.landPriceOrRent < 0) {
      discountedLandPriceOrRent = 1;
      this.discountedLandPriceOrRent = discountedLandPriceOrRent; // set a nominal value : check with Ollie
    } else {
      discountedLandPriceOrRent = this.discountLand * this.landPriceOrRent;
      this.discountedLandPriceOrRent = discountedLandPriceOrRent;
    }
    return discountedLandPriceOrRent;
  }
}

// define the property class
export class Property {
  postcode; // postcode of the property
  houseType; // type of the house: D--> detached, S--> semidetached, T--> Terrace, F--> Flats
  numberOfBedrooms; // number of bedrooms in the house
  age; // age of the house
  size; // size of the house in metre squares
  newBuildPricePerMetre: number; // average build price per metre of a new house
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
        "The Build Price cannot be calculated because pricePerMetre has not been set"
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
  termYears: number; // number of years of the mortgage
  initialDeposit: number; // initial deposit of the value of the mortgage in percentage e.g. 0.15 =15% deposit
  principal?: number; // amount of the morgage requested
  monthlyPayment?: number; // monthly rate of the mortgage
  totalMortgageCost?: number; // total cost of the mortgage
  yearlyPaymentBreakdown?: {
    yearlyPayment: number;
    cumulativePaid: number;
    remainingBalance: number;
  }[]; // yearly breakdown of the mortgage
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
    this.termYears = termOfTheMortgage;
    this.calculateAmountOfTheMortgage(); // calculate the amount of the mortgage
    this.calculateMonthlyMortgagePayment(); // calculate the montly payment
    this.calculateYearlyPaymentBreakdown(); // calculate the yearly breakdown;
  }

  calculateAmountOfTheMortgage() {
    this.principal = this.propertyValue * (1 - this.initialDeposit); // calculate the amount of the mortgage by removing the deposit
    return this.principal;
  }

  calculateMonthlyMortgagePayment() {
    const monthlyInterestRate = this.interestRate / 12; // Convert annual interest rate to monthly rate
    const numberOfPayments = this.termYears * 12; // Convert term in years to total number of payments
    if (this.principal !== undefined) {
      const monthlyPayment =
        (this.principal *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1); // Calculate the monthly payment
      this.monthlyPayment = parseFloat(monthlyPayment.toFixed(2)); // Store monthly payment rounded to 2 decimal places in class property
      this.totalMortgageCost = this.monthlyPayment * numberOfPayments; // total cost of the mortgage
      return this.monthlyPayment;
    } else {
      throw new Error("amountOfTheMortgage is undefined");
    }
  }
  calculateYearlyPaymentBreakdown() {
    if (this.monthlyPayment == undefined || this.totalMortgageCost == undefined)
      throw new Error("monthlyPayment or totalMortgageCost is undefined");

    let yearlyPayment =
      this.initialDeposit * this.propertyValue + this.monthlyPayment * 12;
    let cumulativePaid =
      this.initialDeposit * this.propertyValue + this.monthlyPayment * 12;
    let remainingBalance = this.totalMortgageCost - this.monthlyPayment * 12;

    interface mortgageBreakdownTypes {
      yearlyPayment: number;
      cumulativePaid: number;
      remainingBalance: number;
    }
    let yearlyPaymentBreakdown: mortgageBreakdownTypes[] = [
      {
        yearlyPayment: yearlyPayment,
        cumulativePaid: cumulativePaid,
        remainingBalance: remainingBalance,
      },
    ]; // initialize the yearlyPaymentBreakdown

    for (let i = 0; i < this.termYears - 1; i++) {
      if (i != this.termYears - 1) {
        yearlyPayment = this.monthlyPayment * 12; // calculate the yearly payment
      } else {
        yearlyPayment = remainingBalance; // last year just pay the remaining balance
      }

      cumulativePaid = cumulativePaid + yearlyPayment; // calculate the updated cumulative paid
      remainingBalance = remainingBalance - yearlyPayment; // calculate the updated remaining balance
      yearlyPaymentBreakdown.push({
        yearlyPayment: yearlyPayment,
        cumulativePaid: cumulativePaid,
        remainingBalance: remainingBalance,
      }); // add the current yearly payment to the yearlyPaymentBreakdown
    }
    this.yearlyPaymentBreakdown = yearlyPaymentBreakdown; // set the yearlyPaymentBreakdown
  }
}

export class MarketPurchase {
  affordability?: number; // affordability fo the market
  houseMortgage?: Mortgage; // mortgage object on the new house
  landMortgage?: Mortgage; // mortgage on the land
  lifetime?: {
    maintenanceCost: number;
    landMortgagePaymentYearly: number;
    houseMortgagePaymentYearly: number;
  }[]; // lifetime object with projections

  constructor({
    newBuildPrice, // new build price of the property
    landPrice, // land price
    incomeYearly, // income Yearly per household
    constructionPriceGrowthPerYear, // 2.5% per year
    yearsForecast, // 40 years
    maintenanceCostPercentage, // 1.5% percentage maintenance cost
  }: {
    averagePrice: number;
    newBuildPrice: number;
    depreciatedBuildPrice: number;
    landPrice: number;
    incomeYearly: number;
    propertyPriceGrowthPerYear: number;
    constructionPriceGrowthPerYear: number;
    yearsForecast: number;
    maintenanceCostPercentage: number;
  }) {
    this.calculateHouseMortgage(newBuildPrice);
    this.calculateLandMortgage(landPrice);
    this.calculateAffordability(incomeYearly);
    this.calculateLifetime(
      newBuildPrice,
      maintenanceCostPercentage,
      yearsForecast,
      constructionPriceGrowthPerYear
    );
  }

  calculateHouseMortgage(newBuildPrice: number) {
    this.houseMortgage = new Mortgage({
      propertyValue: newBuildPrice,
    });
  }
  calculateLandMortgage(landPrice: number) {
    this.landMortgage = new Mortgage({
      propertyValue: landPrice,
    });
  }

  calculateAffordability(incomeYearly: number) {
    if (
      this.landMortgage === undefined ||
      this.houseMortgage === undefined ||
      this.landMortgage.monthlyPayment === undefined ||
      this.houseMortgage.monthlyPayment === undefined
    ) {
      throw new Error("landMortgage or houseMortgage is undefined");
    }
    let affordability =
      (this.landMortgage?.monthlyPayment * 12 +
        this.houseMortgage?.monthlyPayment * 12) /
      incomeYearly;
    this.affordability = affordability;
  }

  calculateLifetime(
    newBuildPrice: number,
    maintenanceCostPercentage: number,
    yearsForecast: number,
    constructionPriceGrowthPerYear: number
  ) {
    let newBuildPriceIterative = newBuildPrice;
    let maintenanceCostIterative = maintenanceCostPercentage * newBuildPrice;

    // retrieve the mortgage payments for the first year
    if (
      this.houseMortgage === undefined ||
      this.houseMortgage.yearlyPaymentBreakdown === undefined
    ) {
      throw new Error("houseMortgage is undefined");
    }

    if (
      this.landMortgage === undefined ||
      this.landMortgage.yearlyPaymentBreakdown === undefined
    ) {
      throw new Error("landMortgage is undefined");
    }
    interface mortgageBreakdownTypes {
      yearlyPayment: number;
      cumulativePaid: number;
      remainingBalance: number;
    }
    const houseMortgagePaymentYearly = this.houseMortgage
      .yearlyPaymentBreakdown as mortgageBreakdownTypes[];
    const landMortgagePaymentYearly = this.landMortgage
      .yearlyPaymentBreakdown as mortgageBreakdownTypes[];
    let houseMortgagePaymentYearlyIterative =
      houseMortgagePaymentYearly[0].yearlyPayment; // find the first year
    let landMortgagePaymentYearlyIterative =
      landMortgagePaymentYearly[0].yearlyPayment; // find the first year

    interface lifetimeTypes {
      maintenanceCost: number;
      landMortgagePaymentYearly: number;
      houseMortgagePaymentYearly: number;
    }

    let lifetime: lifetimeTypes[] = [
      {
        maintenanceCost: maintenanceCostIterative,
        landMortgagePaymentYearly: landMortgagePaymentYearlyIterative,
        houseMortgagePaymentYearly: houseMortgagePaymentYearlyIterative,
      },
    ]; // initialize the forecast

    for (let i = 0; i < yearsForecast - 1; i++) {
      newBuildPriceIterative =
        newBuildPriceIterative * (1 + constructionPriceGrowthPerYear); // calculate the new build price at a given year
      maintenanceCostIterative =
        newBuildPriceIterative * maintenanceCostPercentage; // set the current maintenance cost

      if (i < houseMortgagePaymentYearly.length - 1) {
        houseMortgagePaymentYearlyIterative =
          houseMortgagePaymentYearly[i + 1].yearlyPayment; // find the first year
        landMortgagePaymentYearlyIterative =
          landMortgagePaymentYearly[i + 1].yearlyPayment; // find the first year
      } else {
        houseMortgagePaymentYearlyIterative = 0;
        landMortgagePaymentYearlyIterative = 0;
      }

      lifetime.push({
        maintenanceCost: maintenanceCostIterative,
        landMortgagePaymentYearly: landMortgagePaymentYearlyIterative,
        houseMortgagePaymentYearly: houseMortgagePaymentYearlyIterative,
      }); // add the current price to the new build price forecast
    }
    this.lifetime = lifetime; // save the object
  }
}

export class MarketRent {
  affordability?: number; // afforadability
  averageRentMonthly?: number; // average rent per year
  averageRentLandMonthly?: number; // mortgage object on the depreciated house
  averageRentHouseMonthly?: number; // mortgage on the land
  lifetime?: {
    averageRentLandYearly: number;
    averageRentHouseYearly: number;
  }[]; // lifetime object with projections
  constructor({
    averageRentYearly, // average rent per year
    averagePrice, // average price of the property
    newBuildPrice, // average price of the property
    landPrice, // land price
    incomeYearly, // income yearly per household
    propertyPriceGrowthPerYear, // 5% per year
    constructionPriceGrowthPerYear, // 2.5% per year
    yearsForecast, // 40 years
    rentGrowthPerYear, // rent growth per year
  }: {
    averageRentYearly: number;
    averagePrice: number;
    newBuildPrice: number;
    depreciatedBuildPrice: number;
    landPrice: number;
    incomeYearly: number;
    propertyPriceGrowthPerYear: number;
    constructionPriceGrowthPerYear: number;
    yearsForecast: number;
    maintenanceCostPercentage: number;
    rentGrowthPerYear: number;
  }) {
    this.calculateAverageRentLandAndHouse(
      landPrice,
      averagePrice,
      incomeYearly,
      averageRentYearly
    );
    this.calculateLifetime(
      averagePrice,
      newBuildPrice,
      landPrice,
      averageRentYearly,
      yearsForecast,
      propertyPriceGrowthPerYear,
      constructionPriceGrowthPerYear,
      rentGrowthPerYear
    );
  }

  calculateAverageRentLandAndHouse(
    landPrice: number,
    averagePrice: number,
    incomeYearly: number,
    averageRentYearly: number
  ) {
    this.averageRentMonthly = averageRentYearly / 12; // set the average rent per month
    const landToTotalRatio = landPrice / averagePrice;
    this.averageRentLandMonthly = this.averageRentMonthly * landToTotalRatio; // set the avearage rent for the land
    this.averageRentHouseMonthly =
      this.averageRentMonthly - this.averageRentLandMonthly; // set the average rent for the house
    const affordability = averageRentYearly / incomeYearly; // calculate the affordability
    this.affordability = affordability;
  }

  calculateLifetime(
    averagePrice: number,
    newBuildPrice: number,
    landPrice: number,
    averageRentYearly: number,
    yearsForecast: number,
    propertyPriceGrowthPerYear: number,
    constructionPriceGrowthPerYear: number,
    rentGrowthPerYear: number
  ) {
    // initialize the variables that are going to be iterated
    let averagePriceIterative = averagePrice;
    let newBuildPriceIterative = newBuildPrice;
    let landPriceIterative = landPrice;
    let landToTotalRatioIterative = landPrice / averagePrice;
    let averageRentYearlyIterative = averageRentYearly; // yearly rent
    let averageRentLandYearlyIterative =
      averageRentYearlyIterative * landToTotalRatioIterative; // yearly rent for land
    let averageRentHouseYearlyIterative =
      averageRentYearlyIterative - averageRentLandYearlyIterative; // yearly rent for the house

    interface lifetimeTypes {
      averageRentLandYearly: number;
      averageRentHouseYearly: number;
    }

    let lifetime: lifetimeTypes[] = [
      {
        averageRentLandYearly: averageRentLandYearlyIterative,
        averageRentHouseYearly: averageRentHouseYearlyIterative,
      },
    ]; // initialize the forecast

    for (let i = 0; i < yearsForecast - 1; i++) {
      averagePriceIterative =
        averagePriceIterative * (1 + propertyPriceGrowthPerYear); // calculate the average price at a given year
      newBuildPriceIterative =
        newBuildPriceIterative * (1 + constructionPriceGrowthPerYear); // calculate the new build price at a given year
      landPriceIterative = averagePriceIterative - newBuildPriceIterative; // calculate the land price at agiven year
      landToTotalRatioIterative = landPriceIterative / averagePriceIterative; // calculate the land to total ratio
      averageRentYearlyIterative =
        averageRentYearlyIterative * (1 + rentGrowthPerYear); // calculate the current rent
      averageRentLandYearlyIterative =
        averageRentYearlyIterative * landToTotalRatioIterative; // yearly rent for land
      averageRentHouseYearlyIterative =
        averageRentYearlyIterative - averageRentLandYearlyIterative; // yearly rent for the house

      //affordabilityThresholdIncomeIterative =incomeYearlyIterative * affordabilityThresholdIncomePercentage; // affordable income

      lifetime.push({
        averageRentLandYearly: averageRentLandYearlyIterative,
        averageRentHouseYearly: averageRentHouseYearlyIterative,
      }); // add the current price to the new build price forecast
    }
    this.lifetime = lifetime; // save the object
  }
}

export class FairholdLandPurchase {
  discountedLandPrice?: number;
  discountedLandMortgage?: Mortgage;
  depreciatedHouseMortgage?: Mortgage;
  lifetime?: {
    maintenanceCost: number;
    landMortgagePaymentYearly: number;
    houseMortgagePaymentYearly: number;
  }[];
  constructor({
    newBuildPrice, // new build price of the property
    depreciatedBuildPrice, // depreciated building price
    constructionPriceGrowthPerYear, // construction price growth per year
    yearsForecast, // years forecast
    maintenanceCostPercentage, // maintenance cost percentage
    fairhold,
  }: {
    newBuildPrice: number;
    depreciatedBuildPrice: number;
    constructionPriceGrowthPerYear: number;
    yearsForecast: number;
    maintenanceCostPercentage: number;
    incomeGrowthPerYear: number;
    affordability: number;
    fairhold: Fairhold;
  }) {
    this.calculateFairholdDiscount(fairhold); // calculate the fairhold discountLand
    this.calculateMortgage(depreciatedBuildPrice); // calculate the mortgage
    this.calculateLifetime(
      newBuildPrice,
      maintenanceCostPercentage,
      yearsForecast,
      constructionPriceGrowthPerYear
    ); // calculate the lifetime
  }

  calculateFairholdDiscount(fairhold: Fairhold) {
    let discountedLandPrice = fairhold.calculateDiscountedPriceOrRent(); // calculate the discounted land price
    this.discountedLandPrice = discountedLandPrice; // discounted land price
  }

  calculateMortgage(depreciatedBuildPrice: number) {
    if (this.discountedLandPrice == undefined) {
      throw new Error("discountedLandPrice is not defined");
    }
    this.discountedLandMortgage = new Mortgage({
      propertyValue: this.discountedLandPrice,
    });

    this.depreciatedHouseMortgage = new Mortgage({
      propertyValue: depreciatedBuildPrice,
    });
  }

  calculateLifetime(
    newBuildPrice: number,
    maintenanceCostPercentage: number,
    yearsForecast: number,
    constructionPriceGrowthPerYear: number
  ) {
    let newBuildPriceIterative = newBuildPrice;
    let maintenanceCostIterative = maintenanceCostPercentage * newBuildPrice;
    // retrieve the mortgage payments for the first year
    if (
      this.depreciatedHouseMortgage === undefined ||
      this.depreciatedHouseMortgage.yearlyPaymentBreakdown === undefined
    ) {
      throw new Error("depreciatedHouseMortgage is undefined");
    }

    interface mortgageBreakdownTypes {
      yearlyPayment: number;
      cumulativePaid: number;
      remainingBalance: number;
    }
    const houseMortgagePaymentYearly = this.depreciatedHouseMortgage
      .yearlyPaymentBreakdown as mortgageBreakdownTypes[];
    let houseMortgagePaymentYearlyIterative =
      houseMortgagePaymentYearly[0].yearlyPayment; // find the first year

    if (
      this.discountedLandMortgage === undefined ||
      this.discountedLandMortgage.yearlyPaymentBreakdown === undefined
    ) {
      throw new Error("depreciatedHouseMortgage is undefined");
    }

    const landMortgagePaymentYearly = this.discountedLandMortgage
      .yearlyPaymentBreakdown as mortgageBreakdownTypes[];

    let landMortgagePaymentYearlyIterative =
      landMortgagePaymentYearly[0].yearlyPayment; // find the first year

    interface lifetimeTypes {
      maintenanceCost: number;
      landMortgagePaymentYearly: number;
      houseMortgagePaymentYearly: number;
    }

    let lifetime: lifetimeTypes[] = [
      {
        maintenanceCost: maintenanceCostIterative,
        landMortgagePaymentYearly: landMortgagePaymentYearlyIterative,
        houseMortgagePaymentYearly: houseMortgagePaymentYearlyIterative,
      },
    ]; // initialize the forecast
    for (let i = 0; i < yearsForecast - 1; i++) {
      newBuildPriceIterative =
        newBuildPriceIterative * (1 + constructionPriceGrowthPerYear); // calculate the new build price at a given year
      maintenanceCostIterative =
        newBuildPriceIterative * maintenanceCostPercentage; // set the current maintenance cost

      if (i < houseMortgagePaymentYearly.length - 1) {
        houseMortgagePaymentYearlyIterative =
          houseMortgagePaymentYearly[i + 1].yearlyPayment; // find the first year
        landMortgagePaymentYearlyIterative =
          landMortgagePaymentYearly[i + 1].yearlyPayment; // find the first year
      } else {
        houseMortgagePaymentYearlyIterative = 0;
        landMortgagePaymentYearlyIterative = 0;
      }

      lifetime.push({
        maintenanceCost: maintenanceCostIterative,
        landMortgagePaymentYearly: landMortgagePaymentYearlyIterative,
        houseMortgagePaymentYearly: houseMortgagePaymentYearlyIterative,
      }); // add the current price to the new build price forecast
    }
    this.lifetime = lifetime; // save the object
  }
}

export class FairholdLandRent {
  depreciatedHouseMortgage?: Mortgage; // mortgage on the depreciated house
  discountedLandRentMonthly?: number; // discounted land rent
  lifetime?: {
    maintenanceCost: number;
    fairholdRentLand: number;
    houseMortgagePaymentYearly: number;
  }[]; // lifetime object with projections
  constructor({
    averageRentYearly, // average rent per year
    averagePrice, // average price of the property
    newBuildPrice, // new build price of the property
    depreciatedBuildPrice, // depreciated building price
    landPrice, // land price
    incomeYearly, // yearly income per household
    propertyPriceGrowthPerYear, // 5% per year
    constructionPriceGrowthPerYear, // 2.5% per year
    yearsForecast, // 40 years
    maintenanceCostPercentage,
    incomeGrowthPerYear, // 4% per year income growth
    rentGrowthPerYear, // rent growth per year
  }: {
    averageRentYearly: number;
    averagePrice: number;
    newBuildPrice: number;
    depreciatedBuildPrice: number;
    landPrice: number;
    incomeYearly: number;
    affordabilityThresholdIncomePercentage: number;
    propertyPriceGrowthPerYear: number;
    constructionPriceGrowthPerYear: number;
    yearsForecast: number;
    maintenanceCostPercentage: number;
    incomeGrowthPerYear: number;
    rentGrowthPerYear: number;
    fairhold: Fairhold;
  }) {
    this.calculateMortgage(depreciatedBuildPrice);
    this.calculateLifetime(
      averagePrice,
      newBuildPrice,
      landPrice,
      incomeYearly,
      averageRentYearly,
      yearsForecast,
      propertyPriceGrowthPerYear,
      constructionPriceGrowthPerYear,
      incomeGrowthPerYear,
      rentGrowthPerYear,
      maintenanceCostPercentage
    );
  }

  calculateMortgage(depreciatedBuildPrice: number) {
    this.depreciatedHouseMortgage = new Mortgage({
      propertyValue: depreciatedBuildPrice,
    });
  }

  calculateLifetime(
    averagePrice: number,
    newBuildPrice: number,
    landPrice: number,
    incomeYearly: number,
    averageRentYearly: number,
    yearsForecast: number,
    propertyPriceGrowthPerYear: number,
    constructionPriceGrowthPerYear: number,
    incomeGrowthPerYear: number,
    rentGrowthPerYear: number,
    maintenanceCostPercentage: number
  ) {
    // initialize the variables that are going to be iterated
    let averagePriceIterative = averagePrice;
    let newBuildPriceIterative = newBuildPrice;
    let landPriceIterative = landPrice;
    let landToTotalRatioIterative = landPrice / averagePrice;
    let incomeIterative = incomeYearly; // set the current income
    let averageRentYearlyIterative = averageRentYearly; // yearly rent
    let averageRentLandYearlyIterative =
      averageRentYearlyIterative * landToTotalRatioIterative; // yearly rent for land
    let affordabilityIterative = averageRentYearlyIterative / incomeIterative; // affordability
    let maintenanceCostIterative =
      maintenanceCostPercentage * newBuildPriceIterative;

    let fairholdRentLandIterative = new Fairhold({
      affordability: affordabilityIterative,
      landPriceOrRent: averageRentLandYearlyIterative / 12,
    }).calculateDiscountedPriceOrRent(); // calculate the discounted land rent
    this.discountedLandRentMonthly = fairholdRentLandIterative;

    interface mortgageBreakdownTypes {
      yearlyPayment: number;
      cumulativePaid: number;
      remainingBalance: number;
    }

    if (
      this.depreciatedHouseMortgage === undefined ||
      this.depreciatedHouseMortgage.yearlyPaymentBreakdown === undefined
    ) {
      throw new Error("depreciatedHouseMortgage is undefined");
    }

    const houseMortgagePaymentYearly = this.depreciatedHouseMortgage
      .yearlyPaymentBreakdown as mortgageBreakdownTypes[];
    let houseMortgagePaymentYearlyIterative =
      houseMortgagePaymentYearly[0].yearlyPayment; // find the first year

    interface lifetimeTypes {
      maintenanceCost: number;
      fairholdRentLand: number;
      houseMortgagePaymentYearly: number;
    }

    let lifetime: lifetimeTypes[] = [
      {
        maintenanceCost: maintenanceCostIterative,
        fairholdRentLand: fairholdRentLandIterative,
        houseMortgagePaymentYearly: houseMortgagePaymentYearlyIterative,
      },
    ]; // initialize the forecast

    for (let i = 0; i < yearsForecast - 1; i++) {
      averagePriceIterative =
        averagePriceIterative * (1 + propertyPriceGrowthPerYear); // calculate the average price at a given year
      newBuildPriceIterative =
        newBuildPriceIterative * (1 + constructionPriceGrowthPerYear); // calculate the new build price at a given year
      landPriceIterative = averagePriceIterative - newBuildPriceIterative; // calculate the land price at agiven year
      landToTotalRatioIterative = landPriceIterative / averagePriceIterative; // calculate the land to total ratio
      incomeIterative = incomeIterative * (1 + incomeGrowthPerYear); // calculate the current income
      maintenanceCostIterative =
        maintenanceCostPercentage * newBuildPriceIterative; // calculate the curretn maintenance cost

      averageRentYearlyIterative =
        averageRentYearlyIterative * (1 + rentGrowthPerYear); // calculate the current rent

      averageRentLandYearlyIterative =
        averageRentYearlyIterative * landToTotalRatioIterative; // yearly rent for land

      let affordabilityIterative = averageRentYearlyIterative / incomeIterative; // affordability

      let fairholdRentLandIterative = new Fairhold({
        affordability: affordabilityIterative,
        landPriceOrRent: averageRentLandYearlyIterative,
      }).calculateDiscountedPriceOrRent(); // calculate the discounted land rent

      if (i < houseMortgagePaymentYearly.length - 1) {
        houseMortgagePaymentYearlyIterative =
          houseMortgagePaymentYearly[i + 1].yearlyPayment; // find the first year
      } else {
        houseMortgagePaymentYearlyIterative = 0;
      }

      lifetime.push({
        maintenanceCost: maintenanceCostIterative,
        fairholdRentLand: fairholdRentLandIterative,
        houseMortgagePaymentYearly: houseMortgagePaymentYearlyIterative,
      }); // add the current price to the new build price forecast
    }
    this.lifetime = lifetime; // save the object
  }
}

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

// interface for managing the forecastParameters types
interface forecastParameters {
  maintenanceCostPercentage: number;
  incomeGrowthPerYear: number;
  rentGrowthPerYear: number;
  constructionPriceGrowthPerYear: number;
  propertyPriceGrowthPerYear: number;
  yearsForecast: number;
  affordabilityThresholdIncomePercentage: number;
}
export class Household {
  incomePerPersonYearly; // income per person
  gasBillYearly; // gas bill monthly
  property; // property object
  forecastParameters; // forecast parameters
  incomeYearly!: number; // income per household
  tenure: {
    marketPurchase?: MarketPurchase;
    marketRent?: MarketRent;
    socialRent?: SocialRent;
    fairholdLandPurchase?: FairholdLandPurchase;
    fairholdLandRent?: FairholdLandRent;
  }; // grouped tenure field

  lifetime?: {
    affordabilityThresholdIncome: number;
    incomeYearly: number;
  }[];

  constructor({
    incomePerPersonYearly,
    averageRentYearly,
    socialRentAverageEarning,
    socialRentAdjustments,
    housePriceIndex,
    gasBillYearly,
    property,
    forecastParameters = {
      maintenanceCostPercentage: 0.0125, // percentage maintenance cost
      incomeGrowthPerYear: 0.04, // 4% income growth per year
      constructionPriceGrowthPerYear: 0.025, // 2.5%
      rentGrowthPerYear: 0.03, // 3%
      propertyPriceGrowthPerYear: 0.05, // 5%
      yearsForecast: 40, // 40 years
      affordabilityThresholdIncomePercentage: 0.35, // percentage of imcome to afford rent or purchase
    },
  }: {
    incomePerPersonYearly: number;
    averageRentYearly: number;
    socialRentAverageEarning: number;
    socialRentAdjustments: any;
    housePriceIndex: number;
    gasBillYearly: number;
    property: Property;
    forecastParameters: forecastParameters;
  }) {
    this.incomePerPersonYearly = incomePerPersonYearly;
    this.gasBillYearly = gasBillYearly;
    this.property = property;
    this.forecastParameters = forecastParameters;
    this.tenure = {}; // Initialize the tenure object
    this.calculateHouseholdIncome();
    this.calculateTenures(
      averageRentYearly,
      socialRentAverageEarning,
      socialRentAdjustments,
      housePriceIndex
    );
    this.calculateLifetime(
      this.incomeYearly,
      forecastParameters.incomeGrowthPerYear,
      forecastParameters.affordabilityThresholdIncomePercentage,
      forecastParameters.yearsForecast
    );
  }

  calculateHouseholdIncome(houseMultiplier: number = 2.4) {
    this.incomeYearly = houseMultiplier * this.incomePerPersonYearly; // calculate the income for house hold
  }

  calculateTenures(
    averageRentYearly: number,
    socialRentAverageEarning: number,
    socialRentAdjustments: any,
    housePriceIndex: number
  ) {
    if (this.incomeYearly == undefined) throw new Error("income is undefined");
    if (this.property.newBuildPrice == undefined)
      throw new Error("newBuildPrice is undefined");
    if (this.property.depreciatedBuildPrice == undefined)
      throw new Error("depreciatedBuildPrice is undefined");
    if (this.property.landPrice == undefined)
      throw new Error("landPrice is undefined");

    // calculate tenure market purchase
    this.tenure.marketPurchase = new MarketPurchase({
      incomeYearly: this.incomeYearly,
      averagePrice: this.property.averagePrice,
      newBuildPrice: this.property.newBuildPrice,
      depreciatedBuildPrice: this.property.depreciatedBuildPrice,
      landPrice: this.property.landPrice,
      //affordabilityThresholdIncomePercentage:this.forecastParameters.affordabilityThresholdIncomePercentage,
      propertyPriceGrowthPerYear:
        this.forecastParameters.propertyPriceGrowthPerYear,
      constructionPriceGrowthPerYear:
        this.forecastParameters.constructionPriceGrowthPerYear,
      yearsForecast: this.forecastParameters.yearsForecast,
      maintenanceCostPercentage:
        this.forecastParameters.maintenanceCostPercentage,
      //incomeGrowthPerYear: this.forecastParameters.incomeGrowthPerYear,
    });

    //calculate tenure market rent
    this.tenure.marketRent = new MarketRent({
      averageRentYearly: averageRentYearly,
      averagePrice: this.property.averagePrice,
      newBuildPrice: this.property.newBuildPrice,
      depreciatedBuildPrice: this.property.depreciatedBuildPrice,
      landPrice: this.property.landPrice,
      incomeYearly: this.incomeYearly,
      //affordabilityThresholdIncomePercentage:this.forecastParameters.affordabilityThresholdIncomePercentage,
      propertyPriceGrowthPerYear:
        this.forecastParameters.propertyPriceGrowthPerYear,
      constructionPriceGrowthPerYear:
        this.forecastParameters.constructionPriceGrowthPerYear,
      yearsForecast: this.forecastParameters.yearsForecast,
      maintenanceCostPercentage:
        this.forecastParameters.maintenanceCostPercentage,
      //incomeGrowthPerYear: this.forecastParameters.incomeGrowthPerYear,
      rentGrowthPerYear: this.forecastParameters.rentGrowthPerYear,
    });

    //calculate tenure social rent
    this.tenure.socialRent = new SocialRent({
      socialRentAverageEarning: socialRentAverageEarning,
      socialRentAdjustments: socialRentAdjustments,
      housePriceIndex: housePriceIndex,
      property: this.property,
    });

    if (this.tenure.marketPurchase.affordability == undefined)
      throw new Error("tenureMarketPurchase.affordability is undefined");

    this.tenure.fairholdLandPurchase = new FairholdLandPurchase({
      //averagePrice: this.property.averagePrice, // average price of the property
      newBuildPrice: this.property.newBuildPrice,
      depreciatedBuildPrice: this.property.depreciatedBuildPrice,
      //landPrice: this.property.landPrice,
      //incomeYearly: this.incomeYearly, // income Yearly
      //affordabilityThresholdIncomePercentage:this.forecastParameters.affordabilityThresholdIncomePercentage,
      //propertyPriceGrowthPerYear:this.forecastParameters.propertyPriceGrowthPerYear,
      constructionPriceGrowthPerYear:
        this.forecastParameters.constructionPriceGrowthPerYear,
      yearsForecast: this.forecastParameters.yearsForecast,
      maintenanceCostPercentage:
        this.forecastParameters.maintenanceCostPercentage,
      incomeGrowthPerYear: this.forecastParameters.incomeGrowthPerYear,
      affordability: this.tenure.marketPurchase.affordability,
      fairhold: new Fairhold({
        affordability: this.tenure.marketPurchase.affordability,
        landPriceOrRent: this.property.landPrice,
      }),
    });

    if (this.tenure.marketRent.affordability == undefined)
      throw new Error("tenureMarketRent.affordability is undefined");

    this.tenure.fairholdLandRent = new FairholdLandRent({
      averageRentYearly: averageRentYearly,
      averagePrice: this.property.averagePrice, // average price of the property
      newBuildPrice: this.property.newBuildPrice,
      depreciatedBuildPrice: this.property.depreciatedBuildPrice, // depreciated building price
      landPrice: this.property.landPrice, // land price
      incomeYearly: this.incomeYearly, // income
      affordabilityThresholdIncomePercentage:
        this.forecastParameters.affordabilityThresholdIncomePercentage, //  affordability threshold percentage
      propertyPriceGrowthPerYear:
        this.forecastParameters.propertyPriceGrowthPerYear, // property price growth per year
      constructionPriceGrowthPerYear:
        this.forecastParameters.constructionPriceGrowthPerYear, // construction price growth per year
      yearsForecast: this.forecastParameters.yearsForecast, // years forecast
      maintenanceCostPercentage:
        this.forecastParameters.maintenanceCostPercentage, // maintenance cost percentage
      incomeGrowthPerYear: this.forecastParameters.incomeGrowthPerYear, // income growth per year
      rentGrowthPerYear: this.forecastParameters.rentGrowthPerYear, // rent growth per year

      fairhold: new Fairhold({
        affordability: this.tenure.marketRent.affordability,
        landPriceOrRent: averageRentYearly,
      }), // fairhold object
    });
  }

  calculateLifetime(
    incomeYearly: number,
    incomeGrowthPerYear: number,
    affordabilityThresholdIncomePercentage: number,
    yearsForecast: number
  ) {
    let incomeYearlyIterative = incomeYearly; // set the current income
    let affordabilityThresholdIncomeIterative =
      incomeYearlyIterative * affordabilityThresholdIncomePercentage; // affordable income

    interface lifetimeTypes {
      affordabilityThresholdIncome: number;
      incomeYearly: number;
    }
    let lifetime: lifetimeTypes[] = [
      {
        incomeYearly: incomeYearlyIterative,
        affordabilityThresholdIncome: affordabilityThresholdIncomeIterative,
      },
    ];

    for (let i = 0; i < yearsForecast - 1; i++) {
      incomeYearlyIterative = incomeYearlyIterative * (1 + incomeGrowthPerYear); // calculate the current income
      affordabilityThresholdIncomeIterative =
        incomeYearlyIterative * affordabilityThresholdIncomePercentage; // affordable income

      lifetime.push({
        incomeYearly: incomeYearlyIterative,
        affordabilityThresholdIncome: affordabilityThresholdIncomeIterative,
      });
    }
    this.lifetime = lifetime;
  }
}
