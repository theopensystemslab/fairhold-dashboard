import { MarketPurchase } from "./tenure/MarketPurchase";
import { MarketRent } from "./tenure/MarketRent";
import { FairholdLandPurchase } from "./tenure/FairholdLandPurchase";
import { FairholdLandRent } from "./tenure/FairholdLandRent";
import { Fairhold } from "./Fairhold";
import { Property } from "./Property";
import { SocialRent } from "./tenure/SocialRent";
import { ForecastParameters } from "./ForecastParameters";
import { socialRentAdjustmentTypes } from "../data/socialRentAdjustmentsRepo";
import { Lifetime, LifetimeParams } from "./Lifetime"; 

const HOUSE_MULTIPLIER = 2.4;

type ConstructorParams = Pick<
  Household,
  "incomePerPersonYearly" | "gasBillAverageYearly" | "property" | "forecastParameters"
> & {
  averageRentYearly: number;
  socialRentAverageEarning: number;
  socialRentAdjustments: socialRentAdjustmentTypes;
  housePriceIndex: number;
};

export class Household {
  public incomePerPersonYearly: number;
  public gasBillAverageYearly: number;
  public gasBillAdjustedYearly: number;
  public gasBillRetrofitYearly: number;
  public property: Property;
  public forecastParameters: ForecastParameters;
  public incomeYearly: number;
  public tenure: {
    marketPurchase: MarketPurchase;
    marketRent: MarketRent;
    socialRent: SocialRent;
    fairholdLandPurchase: FairholdLandPurchase;
    fairholdLandRent: FairholdLandRent;
  };
  public lifetime: Lifetime;

  constructor(params: ConstructorParams) {
    this.incomePerPersonYearly = params.incomePerPersonYearly;
    this.gasBillAverageYearly = params.gasBillAverageYearly;
    this.property = params.property;
    this.gasBillAdjustedYearly = this.calculateGasBillAdjustedYearly();
    this.gasBillRetrofitYearly = this.calculateGasBillRetrofitYearly();
    this.forecastParameters = params.forecastParameters;
    this.incomeYearly = HOUSE_MULTIPLIER * params.incomePerPersonYearly;
    this.tenure = this.calculateTenures(params);
    this.lifetime = this.calculateLifetime(params);
  }

  private calculateTenures({
    averageRentYearly,
    socialRentAverageEarning,
    socialRentAdjustments,
    housePriceIndex,
  }: ConstructorParams) {
    const marketPurchase = new MarketPurchase({
      incomeYearly: this.incomeYearly,
      averagePrice: this.property.averageMarketPrice,
      newBuildPrice: this.property.newBuildPrice,
      depreciatedBuildPrice: this.property.depreciatedBuildPrice,
      landPrice: this.property.landPrice,
      propertyPriceGrowthPerYear:
        this.forecastParameters.propertyPriceGrowthPerYear,
      constructionPriceGrowthPerYear:
        this.forecastParameters.constructionPriceGrowthPerYear,
      yearsForecast: this.forecastParameters.yearsForecast,
      maintenanceCostPercentage:
        this.forecastParameters.maintenanceCostPercentage,
    });

    const marketRent = new MarketRent({
      averageRentYearly: averageRentYearly,
      averagePrice: this.property.averageMarketPrice,
      newBuildPrice: this.property.newBuildPrice,
      depreciatedBuildPrice: this.property.depreciatedBuildPrice,
      landPrice: this.property.landPrice,
      incomeYearly: this.incomeYearly,
      propertyPriceGrowthPerYear:
        this.forecastParameters.propertyPriceGrowthPerYear,
      constructionPriceGrowthPerYear:
        this.forecastParameters.constructionPriceGrowthPerYear,
      yearsForecast: this.forecastParameters.yearsForecast,
      maintenanceCostPercentage:
        this.forecastParameters.maintenanceCostPercentage,
      rentGrowthPerYear: this.forecastParameters.rentGrowthPerYear,
    });

    const socialRent = new SocialRent({
      socialRentAverageEarning,
      socialRentAdjustments,
      housePriceIndex,
      landToTotalRatio: this.property.landToTotalRatio,
      numberOfBedrooms: this.property.numberOfBedrooms,
    });

    const fairholdLandPurchase = new FairholdLandPurchase({
      newBuildPrice: this.property.newBuildPrice,
      depreciatedBuildPrice: this.property.depreciatedBuildPrice,
      constructionPriceGrowthPerYear:
        this.forecastParameters.constructionPriceGrowthPerYear,
      yearsForecast: this.forecastParameters.yearsForecast,
      maintenanceCostPercentage:
        this.forecastParameters.maintenanceCostPercentage,
      incomeGrowthPerYear: this.forecastParameters.incomeGrowthPerYear,
      affordability: marketPurchase.affordability,
      fairhold: new Fairhold({
        affordability: marketPurchase.affordability,
        landPriceOrRent: this.property.landPrice,
      }),
    });

    const fairholdLandRent = new FairholdLandRent({
      averageRentYearly: averageRentYearly,
      averagePrice: this.property.averageMarketPrice, // average price of the property
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
        affordability: marketRent.affordability,
        landPriceOrRent: averageRentYearly,
      }), // fairhold object
    });

    return {
      marketPurchase,
      marketRent,
      socialRent,
      fairholdLandPurchase,
      fairholdLandRent,
    };
  }

    private calculateLifetime(params: ConstructorParams): Lifetime {
      const lifetimeParams: LifetimeParams = {
        marketPurchase: this.tenure.marketPurchase,
        marketRent: this.tenure.marketRent,
        fairholdLandPurchase: this.tenure.fairholdLandPurchase,
        fairholdLandRent: this.tenure.fairholdLandRent,
        property: this.property,
        propertyPriceGrowthPerYear: params.forecastParameters.propertyPriceGrowthPerYear,
        constructionPriceGrowthPerYear: params.forecastParameters.constructionPriceGrowthPerYear,
        rentGrowthPerYear: params.forecastParameters.rentGrowthPerYear,
        yearsForecast: params.forecastParameters.yearsForecast,
        maintenanceCostPercentage: params.forecastParameters.maintenanceCostPercentage,
        incomeGrowthPerYear: params.forecastParameters.incomeGrowthPerYear,
        affordabilityThresholdIncomePercentage: params.forecastParameters.affordabilityThresholdIncomePercentage,
        incomeYearly: this.incomeYearly,
        gasBillAdjustedYearly: this.gasBillAdjustedYearly,
        gasBillRetrofitYearly: this.gasBillRetrofitYearly
      };
      return new Lifetime(lifetimeParams);
    }

  private calculateGasBillAdjustedYearly() {
    const averageHeatDemandKwhByType = {
      "F": 118, // Figures from LETI, via Studio PDP
      "T": 110,
      "S": 168,
      "D": 167,
    }
    const costPerKwh = this.gasBillAverageYearly / 13600 // 13,600 kwh is assumed in the data
    const gasBillAdjustedYearly = costPerKwh * this.property.size * averageHeatDemandKwhByType[this.property.houseType]
    return gasBillAdjustedYearly
  } 

  private calculateGasBillRetrofitYearly() {
    const retrofitHeatDemandKwhByType = {
        "F": 26, // Figures from LETI, via Studio PDP
        "T": 20,
        "S": 51,
        "D": 55,
      }
      const costPerKwh = this.gasBillAverageYearly / 13600 // 13,600 kwh is assumed in the data
      const gasBillRetrofitYearly = costPerKwh * this.property.size * retrofitHeatDemandKwhByType[this.property.houseType]
      return gasBillRetrofitYearly
  }
};