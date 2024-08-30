import { MarketPurchase } from "./tenure/MarketPurchase";
import { MarketRent } from "./tenure/MarketRent";
import { FairholdLandPurchase } from "./tenure/FairholdLandPurchase";
import { FairholdLandRent } from "./tenure/FairholdLandRent";
import { Fairhold } from "./Fairhold";
import { Property } from "./Property";
import { ForecastParameters, DEFAULT_FORECAST_PARAMETERS } from "./ForecastParameters";
import { SocialRent } from "./tenure/SocialRent";
import { ForecastParameters } from "./ForecastParameters";
import { socialRentAdjustmentTypes } from "../data/socialRentAdjustmentsRepo";

const HOUSE_MULTIPLIER = 2.4;

type ConstructorParams = Pick<
  Household,
  "incomePerPersonYearly" | "gasBillYearly" | "property" | "forecastParameters"
> & {
  averageRentYearly: number;
  socialRentAverageEarning: number;
  socialRentAdjustments: socialRentAdjustmentTypes;
  housePriceIndex: number;
};

type Lifetime = {
  affordabilityThresholdIncome: number;
  incomeYearly: number;
}[];

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
    forecastParameters,
  }: {
    incomePerPersonYearly: number;
    averageRentYearly: number;
    socialRentAverageEarning: number;
    socialRentAdjustments: SocialRentAdjustments;
    housePriceIndex: number;
    gasBillYearly: number;
    property: Property;
    forecastParameters: ForecastParameters;
  }) {
    this.incomePerPersonYearly = incomePerPersonYearly;
    this.gasBillYearly = gasBillYearly;
    this.property = property;
    this.forecastParameters = { ...DEFAULT_FORECAST_PARAMETERS, ...forecastParameters };
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
    socialRentAdjustments: SocialRentAdjustments,
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
      averagePrice: this.property.averageMarketPrice,
      newBuildPrice: this.property.newBuildPrice,
      depreciatedBuildPrice: this.property.depreciatedBuildPrice,
      landPrice: this.property.landPrice,
      forecastParameters: this.forecastParameters, 
    });

    //calculate tenure market rent
    this.tenure.marketRent = new MarketRent({
      averageRentYearly: averageRentYearly,
      averagePrice: this.property.averageMarketPrice,
      newBuildPrice: this.property.newBuildPrice,
      depreciatedBuildPrice: this.property.depreciatedBuildPrice,
      landPrice: this.property.landPrice,
      incomeYearly: this.incomeYearly,
      forecastParameters: this.forecastParameters, 
    });

    //calculate tenure social rent
    this.tenure.socialRent = new SocialRent({
      numberOfBedrooms: this.property.numberOfBedrooms,
      socialRentAverageEarning: socialRentAverageEarning,
      socialRentAdjustments: socialRentAdjustments,
      housePriceIndex: housePriceIndex,
      landToTotalRatio: this.property.landToTotalRatio
    });

    if (this.tenure.marketPurchase.affordability == undefined)
      throw new Error("tenureMarketPurchase.affordability is undefined");

    this.tenure.fairholdLandPurchase = new FairholdLandPurchase({
      //averagePrice: this.property.averageMarketPrice, // average price of the property
      newBuildPrice: this.property.newBuildPrice,
      depreciatedBuildPrice: this.property.depreciatedBuildPrice,
      //landPrice: this.property.landPrice,
      //incomeYearly: this.incomeYearly, // income Yearly
      //affordabilityThresholdIncomePercentage:this.forecastParameters.affordabilityThresholdIncomePercentage,
      //propertyPriceGrowthPerYear:this.forecastParameters.propertyPriceGrowthPerYear,
      forecastParameters: this.forecastParameters,
      affordability: this.tenure.marketPurchase.affordability,
      fairhold: new Fairhold({
        affordability: this.tenure.marketPurchase.affordability,
        landPriceOrRent: this.property.landPrice,
      }),
    });

    if (this.tenure.marketRent.affordability == undefined)
      throw new Error("tenureMarketRent.affordability is undefined");

    this.tenure.fairholdLandRent = new FairholdLandRent({
      averageRentYearly,
      averagePrice: this.property.averageMarketPrice, // average price of the property
      newBuildPrice: this.property.newBuildPrice,
      depreciatedBuildPrice: this.property.depreciatedBuildPrice, // depreciated building price
      landPrice: this.property.landPrice, // land price
      incomeYearly: this.incomeYearly, // income
      fairhold: new Fairhold({
        affordability: this.tenure.marketRent.affordability,
        landPriceOrRent: averageRentYearly,
      }), // fairhold object
      forecastParameters: this.forecastParameters, 
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
    const lifetime: lifetimeTypes[] = [
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
