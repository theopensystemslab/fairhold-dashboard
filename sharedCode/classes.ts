// import useful libraries
import * as math from "mathjs";

//define the fairhold object for Land Purchase
export class FairholdLandPurchase {
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
  combinedHouseAndLandPrice?: number;
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
    this.combinedHouseAndLandPrice = this.discountedLandPrice + this.housePrice; // set the total price
  }
}

//define the fairhold object for Land Purchase
export class FairholdLandRent {
  affordability;
  originalLandRent;
  housePrice;
  amplitude;
  length;
  position;
  plateau;
  threshold;
  discountLand?: number;
  discountedLandRent?: number;
  combinedHouseAndLandPrice?: number;
  constructor({
    affordability,
    originalLandRent,
    housePrice,
    amplitude = 0.25,
    length = 1,
    position = 0.45,
    plateau = 0.15,
    threshold = 0.5,
  }: {
    affordability: number;
    originalLandRent: number;
    housePrice: number;
    amplitude?: number;
    length?: number;
    position?: number;
    plateau?: number;
    threshold?: number;
  }) {
    this.affordability = affordability; // affordability index
    this.originalLandRent = originalLandRent; // price before the discountLand
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

    if (this.originalLandRent < 0) {
      this.discountedLandRent = 1; // set a nominal value : check with Ollie
    } else {
      this.discountedLandRent = this.discountLand * this.originalLandRent;
    }
    this.combinedHouseAndLandPrice = this.discountedLandRent + this.housePrice; // set the total price
  }
}

// define the Lifetime class
export class Lifetime {
  currentAveragePrice; // current average price
  currentNewBuildPrice; // current new build price
  currentLandPrice; // current land price
  currentIncome; // current house hold income
  currentGasBillYearly; // current gas bill
  currentRentYearly; // current rent
  currentFairholdLandRentYearly; // current fairhold rent
  affordabilityThresholdIncomePercentage; //  affordability threshold percentage
  propertyPriceGrowthPerYear; // property price growth per year
  constructionPriceGrowthPerYear; // construction price growth per year
  yearsForecast; // years forecast
  maintenanceCostPercentage; // maintenance cost percentage
  incomeGrowthPerYear; // income growth per year
  cpiGrowthPerYear; // cpi gowth per year
  rentGrowthPerYear; // rent growth per year
  currentMaintenanceCost?: number; // current maintenance cost
  lifetimeMarket?: object; // forecast of the property values

  constructor({
    currentAveragePrice,
    currentNewBuildPrice,
    currentLandPrice,
    currentIncome,
    currentGasBillYearly,
    currentRentYearly,
    currentFairholdLandRentYearly,
    affordabilityThresholdIncomePercentage = 0.35, // percentage of income that makes a property afforadable
    propertyPriceGrowthPerYear = 0.05, // 5% per year
    constructionPriceGrowthPerYear = 0.025, // 2.5% per year
    rentGrowthPerYear = 0.025, //2.5% per year
    yearsForecast = 40, // 3 years
    maintenanceCostPercentage = 0.015, // 1.5% percentage maintenance cost
    incomeGrowthPerYear = 0.04, // 4% per year income growth
    cpiGrowthPerYear = 0.03, // 3% per year cpi growth
  }: {
    currentAveragePrice: number;
    currentNewBuildPrice: number;
    currentLandPrice: number;
    currentIncome: number;
    currentGasBillYearly: number;
    currentRentYearly: number;
    currentFairholdLandRentYearly: number;
    affordabilityThresholdIncomePercentage?: number;
    propertyPriceGrowthPerYear?: number;
    constructionPriceGrowthPerYear?: number;
    rentGrowthPerYear?: number;
    yearsForecast?: number;
    maintenanceCostPercentage?: number;
    incomeGrowthPerYear?: number;
    cpiGrowthPerYear?: number;
  }) {
    this.currentAveragePrice = currentAveragePrice;
    this.currentNewBuildPrice = currentNewBuildPrice;
    this.currentLandPrice = currentLandPrice;
    this.currentIncome = currentIncome;
    this.currentGasBillYearly = currentGasBillYearly;
    this.currentRentYearly = currentRentYearly;
    this.currentFairholdLandRentYearly = currentFairholdLandRentYearly;
    this.affordabilityThresholdIncomePercentage =
      affordabilityThresholdIncomePercentage;
    this.propertyPriceGrowthPerYear = propertyPriceGrowthPerYear;
    this.constructionPriceGrowthPerYear = constructionPriceGrowthPerYear;
    this.rentGrowthPerYear = rentGrowthPerYear;
    this.yearsForecast = yearsForecast;
    this.maintenanceCostPercentage = maintenanceCostPercentage;
    this.currentMaintenanceCost =
      this.currentNewBuildPrice * this.maintenanceCostPercentage;
    this.incomeGrowthPerYear = incomeGrowthPerYear;
    this.cpiGrowthPerYear = cpiGrowthPerYear;

    this.calculateForecast();
  }

  calculateForecast() {
    // create the interface
    interface lifetimeTypes {
      year: number;
      averagePrice: number;
      newBuildPrice: number;
      landPrice: number;
      maintenanceCost: number;
      landToTotalRatio: number;
      income: number;
      gasBillYearly: number;
      rentYearly: number;
      rentYearlyLand: number;
      rentYearlyHouse: number;
      rentLandFairholdYearly: number;
      affordabilityThresholdIncome: number;
    }

    // initialize the variables
    let averagePriceByYear = this.currentAveragePrice;
    let newBuildPriceByYear = this.currentNewBuildPrice;
    let landPriceByYear = this.currentLandPrice;
    if (this.currentMaintenanceCost === undefined) {
      throw new Error("currentMaintenanceCost is not defined");
    }
    let maintenanceCostByYear = this.currentMaintenanceCost;
    let landToTotalRatioByYear =
      this.currentLandPrice / this.currentAveragePrice;

    let incomeByYear = this.currentIncome; // set the current income
    let gasBillYearlyByYear = this.currentGasBillYearly; // set the current gas bill
    let rentYearlyByYear = this.currentRentYearly; // set the current rent
    let rentYearlyLandByYear = this.currentRentYearly * landToTotalRatioByYear; // rent value for the land
    let rentYearlyHouseByYear = this.currentRentYearly - rentYearlyLandByYear; // rent value for the house
    let rentLandFairholdYearlyByYear = this.currentFairholdLandRentYearly; // rent value for the fairhold land
    let affordabilityThresholdIncomeByYear =
      incomeByYear * this.affordabilityThresholdIncomePercentage; // affordable income

    let lifetimeMarket: lifetimeTypes[] = [
      {
        year: 0,
        averagePrice: averagePriceByYear,
        newBuildPrice: newBuildPriceByYear,
        maintenanceCost: maintenanceCostByYear,
        landPrice: landPriceByYear,
        landToTotalRatio: landToTotalRatioByYear,
        income: incomeByYear,
        gasBillYearly: gasBillYearlyByYear,
        rentYearly: rentYearlyByYear,
        rentYearlyLand: rentYearlyLandByYear,
        rentYearlyHouse: rentYearlyHouseByYear,
        rentLandFairholdYearly: rentLandFairholdYearlyByYear,
        affordabilityThresholdIncome: affordabilityThresholdIncomeByYear,
      },
    ]; // initialize the forecast

    for (let i = 0; i < this.yearsForecast; i++) {
      averagePriceByYear =
        averagePriceByYear * (1 + this.propertyPriceGrowthPerYear); // calculate the average price at a given year

      newBuildPriceByYear =
        newBuildPriceByYear * (1 + this.constructionPriceGrowthPerYear); // calculate the new build price at a given year

      landPriceByYear = averagePriceByYear - newBuildPriceByYear; // calculate the land price at agiven year
      maintenanceCostByYear =
        newBuildPriceByYear * this.maintenanceCostPercentage; // set the current maintenance cost

      landToTotalRatioByYear = landPriceByYear / averagePriceByYear; // calculate the land to total ratio

      incomeByYear = incomeByYear * (1 + this.incomeGrowthPerYear); // calculate the current income
      gasBillYearlyByYear = gasBillYearlyByYear * (1 + this.cpiGrowthPerYear); // calculate the current gas bill
      rentYearlyByYear = rentYearlyByYear * (1 + this.rentGrowthPerYear); // calculate the current rent

      rentYearlyLandByYear = rentYearlyByYear * landToTotalRatioByYear; // calculate the portion of rent for the land
      rentYearlyHouseByYear = rentYearlyByYear - rentYearlyLandByYear; // calculate the portion of rent for the house
      affordabilityThresholdIncomeByYear =
        incomeByYear * this.affordabilityThresholdIncomePercentage; // affordable income

      // calculate fairhold every year
      let rentAffordabilityByYear = rentYearlyByYear / incomeByYear; // calculate the affordability at a given year
      let fairholdLandRent = new FairholdLandRent({
        affordability: rentAffordabilityByYear,
        originalLandRent: rentYearlyLandByYear,
        housePrice: 0,
      }); // create the fairhold object for rent. The house price is set to 0 since only the mohtly rent is needed
      if (fairholdLandRent.discountedLandRent == undefined)
        throw new Error("fairholdLandRent.discountedLandRent is not defined");
      rentLandFairholdYearlyByYear = fairholdLandRent.discountedLandRent;

      lifetimeMarket.push({
        year: i + 1,
        averagePrice: averagePriceByYear,
        newBuildPrice: newBuildPriceByYear,
        maintenanceCost: maintenanceCostByYear,
        landPrice: landPriceByYear,
        landToTotalRatio: landToTotalRatioByYear,
        income: incomeByYear,
        gasBillYearly: gasBillYearlyByYear,
        rentYearly: rentYearlyByYear,
        rentYearlyLand: rentYearlyLandByYear,
        rentYearlyHouse: rentYearlyHouseByYear,
        rentLandFairholdYearly: rentLandFairholdYearlyByYear,
        affordabilityThresholdIncome: affordabilityThresholdIncomeByYear,
      }); // add the current price to the new build price forecast
    }
    this.lifetimeMarket = lifetimeMarket; // save the object
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
  termOfTheMortgage: number; // number of years of the mortgage
  initialDeposit: number; // initial deposit of the value of the mortgage in percentage e.g. 0.15 =15% deposit
  amountOfTheMortgage?: number; // amount of the morgage requested
  monthlyPayment?: number; // monthly rate of the mortgage
  totalMortgageCost?: number; // total cost of the mortgage
  yearlyPaymentBreakdown?: object; // yearly breakdown of the mortgage
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
    this.calculateAmountOfTheMortgage(); // calculate the amount of the mortgage
    this.calculateMonthlyMortgagePayment(); // calculate the montly payment
    this.calculateYearlyPaymentBreakdown(); // calculate the yearly breakdown
  }

  calculateAmountOfTheMortgage() {
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

    let yearlyPaymentBreakdown = [
      {
        year: 0,
        yearlyPayment: yearlyPayment,
        cumulativePaid: cumulativePaid,
        remainingBalance: remainingBalance,
      },
    ]; // initialize the yearlyPaymentBreakdown

    for (let i = 0; i < this.termOfTheMortgage - 1; i++) {
      if (i != this.termOfTheMortgage - 1) {
        yearlyPayment = this.monthlyPayment * 12; // calculate the yearly payment
      } else {
        yearlyPayment = remainingBalance; // last year just pay the remaining balance
      }

      cumulativePaid = cumulativePaid + yearlyPayment; // calculate the updated cumulative paid
      remainingBalance = remainingBalance - yearlyPayment; // calculate the updated remaining balance
      yearlyPaymentBreakdown.push({
        year: i + 1,
        yearlyPayment: yearlyPayment,
        cumulativePaid: cumulativePaid,
        remainingBalance: remainingBalance,
      }); // add the current yearly payment to the yearlyPaymentBreakdown
    }
    this.yearlyPaymentBreakdown = yearlyPaymentBreakdown; // set the yearlyPaymentBreakdown
  }
}

export class Household {
  incomePerPerson; // income per person
  averageRent; // average rent
  socialRentAveEarning; // average social rent
  socialRentAdjustments; //rent adjustment values
  housePriceIndex; // house price index
  gasBillYearly; // gas bill monthly
  property; // property object
  averageRentLand?: number; // average rent for the land
  averageRentHouse?: number; // average rent for the house
  income?: number; // income per household
  adjustedSocialRentMonthly?: number; //adjusted social rent monthly
  socialRentMonthlyLand?: number; // social rent to pay the land
  socialRentMonthlyHouse?: number; // social rent monthly House
  relativeLocalEarning?: number;
  formulaRentWeekly?: number; // weekly rent
  mortgageMarket?: Mortgage; // mortgage on the whole property value
  mortgageHouse?: Mortgage; // mortgage on the house
  mortgageDepreciatedHouse?: Mortgage; // mortgage on the depreciated house
  mortgageLand?: Mortgage; // mortgage on the land
  mortgageMarketAffordability?: number;
  rentAffordability?: number;
  fairholdLandPurchase?: FairholdLandPurchase;
  mortgageFairholdLandPurchase?: Mortgage; // mortgage on the land purchased with fairhold
  fairholdLandRent?: FairholdLandRent;
  relativePropertyValue?: number;
  lifetime?: Lifetime;

  constructor({
    incomePerPerson,
    averageRent,
    socialRentAveEarning,
    socialRentAdjustments,
    housePriceIndex,
    gasBillYearly,
    property,
  }: {
    incomePerPerson: number;
    averageRent: number;
    socialRentAveEarning: number;
    socialRentAdjustments: any;
    housePriceIndex: number;
    gasBillYearly: number;
    property: Property;
  }) {
    this.incomePerPerson = incomePerPerson;
    this.averageRent = averageRent;
    this.socialRentAveEarning = socialRentAveEarning;
    this.socialRentAdjustments = socialRentAdjustments;
    this.housePriceIndex = housePriceIndex;
    this.gasBillYearly = gasBillYearly;
    this.property = property;
    this.calculateAverageRentLandAndHouse();
    this.calculateSocialRent();
    this.calculateHouseholdIncome();
    this.calculateMortgageValues();
    this.calculateFairholdValues();
    this.calculateForecast();
  }

  calculateAverageRentLandAndHouse() {
    if (this.property.landToTotalRatio == undefined)
      throw new Error("landToTotalRatio is undefined");
    this.averageRentLand = this.averageRent * this.property.landToTotalRatio; // set the avearage rent for the land
    this.averageRentHouse = this.averageRent - this.averageRentLand; // set the average rent for the house
  }
  calculateSocialRent(
    numberOfBeds: number = this.property.numberOfBedrooms,
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
      this.socialRentAveEarning / nationalAverageEarnings; // relative local earnings
    this.relativeLocalEarning = relativeLocalEarning;

    const relativePropertyValue =
      this.housePriceIndex / nationalAverageProperty; // relative property value
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

    let socialRentWeekly; // initialize the variable
    if (adjustedRentWeekly < rentCapWeekly) {
      socialRentWeekly = adjustedRentWeekly;
    } else {
      socialRentWeekly = rentCapWeekly;
    }

    const adjustedSocialRentMonthly = socialRentWeekly * 4.2; // define the monthly social rent

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
    }); // create the mortgage object for the depreciated build price
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
    this.fairholdLandPurchase = new FairholdLandPurchase({
      affordability: this.mortgageMarketAffordability,
      originalLandPrice: this.property.landPrice,
      housePrice: this.property.depreciatedBuildPrice,
    }); // create the fairhold object for purchase

    if (this.fairholdLandPurchase.combinedHouseAndLandPrice == undefined)
      throw new Error("fairholdLandPurchase.discountedLandPrice is undefined");
    this.mortgageFairholdLandPurchase = new Mortgage({
      propertyValue: this.fairholdLandPurchase.combinedHouseAndLandPrice,
    });

    this.mortgageDepreciatedHouse = new Mortgage({
      propertyValue: this.property.depreciatedBuildPrice,
    }); // mortgage calculated on the depreciated house price

    if (this.mortgageDepreciatedHouse.monthlyPayment == undefined)
      throw new Error("mortgageDepreciatedHouse.monthlyPayment is undefined");
    this.fairholdLandRent = new FairholdLandRent({
      affordability: this.rentAffordability,
      originalLandRent: this.averageRentLand,
      housePrice: this.mortgageDepreciatedHouse.monthlyPayment,
    }); // create the fairhold object for rent
  }
  calculateForecast() {
    if (
      this.property.averagePrice == undefined ||
      this.income == undefined ||
      this.property.newBuildPrice == undefined ||
      this.property.landPrice == undefined ||
      this.gasBillYearly == undefined ||
      this.averageRentLand == undefined ||
      this.averageRentHouse == undefined ||
      this.fairholdLandRent?.discountedLandRent == undefined
    )
      throw new Error(
        "Either property.averagePrice or property.newBuildPrice or property.landPrice or income or gasBillYearly or averageRentLand or averageRentHouseis or fairholdLandRent?.discountedLandRent undefined"
      );

    this.lifetime = new Lifetime({
      currentAveragePrice: this.property.averagePrice,
      currentNewBuildPrice: this.property.newBuildPrice,
      currentLandPrice: this.property.landPrice,
      currentIncome: this.income,
      currentGasBillYearly: this.gasBillYearly,
      currentRentYearly: this.averageRent * 12,
      currentFairholdLandRentYearly:
        this.fairholdLandRent.discountedLandRent * 12,
    });
  }
}

// create the interface
export interface forecastTypes {
  year: number;
  averagePrice: number;
  newBuildPrice: number;
  landPrice: number;
  maintenanceCost: number;
  landToTotalRatio: number;
  income: number;
  gasBillYearly: number;
  rentYearly: number;
  rentYearlyLand: number;
  rentYearlyHouse: number;
  rentFairholdYearly: number;
  affordableIncomeYearly: number;
}