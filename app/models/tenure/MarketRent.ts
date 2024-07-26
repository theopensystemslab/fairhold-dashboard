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
