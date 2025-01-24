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
import { KWH_M2_YR_EXISTING_BUILDS, KWH_M2_YR_NEWBUILDS_RETROFIT } from "./constants" ;

const HEADS_PER_HOUSEHOLD = 2.4;

type ConstructorParams = Pick<
  Household,
  "incomePerPersonYearly" | "kwhCostPence" | "property" | "forecastParameters"
> & {
  averageRentYearly: number;
  socialRentAverageEarning: number;
  socialRentAdjustments: socialRentAdjustmentTypes;
  /** The housePriceIndex shown here is used to calculate relative property values and should be from 1999. */
  housePriceIndex: number;
};

/** The 'parent' class; when instantiated, it instantiates all other relevant classes, including `Property` */
export class Household {
  public incomePerPersonYearly: number;
  public kwhCostPence: number;
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
  public gasDemand = {
    kwhExistingBuildYearly: 0,
    kwhNewBuildOrRetrofitYearly: 0,
    billExistingBuildYearly: 0,
    billNewBuildOrRetrofitYearly: 0
  }

  constructor(params: ConstructorParams) {
    this.incomePerPersonYearly = params.incomePerPersonYearly;
    this.kwhCostPence = params.kwhCostPence;
    this.property = params.property;
    this.forecastParameters = params.forecastParameters;
    this.incomeYearly = HEADS_PER_HOUSEHOLD * params.incomePerPersonYearly;
    this.gasDemand = this.calculateGasDemand(params)
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
      forecastParameters: this.forecastParameters,
    });

    const marketRent = new MarketRent({
      averageRentYearly: averageRentYearly,
      newBuildPrice: this.property.newBuildPrice,
      depreciatedBuildPrice: this.property.depreciatedBuildPrice,
      incomeYearly: this.incomeYearly,
      landToTotalRatio: this.property.landToTotalRatio,
      forecastParameters: this.forecastParameters,
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
      forecastParameters: this.forecastParameters,
      affordability: marketPurchase.affordability,
      fairhold: new Fairhold({
        affordability: marketPurchase.affordability,
        landPriceOrRent: this.property.landPrice,
      }),
      marketPurchase: marketPurchase
    });

    const fairholdLandRent = new FairholdLandRent({
      averageRentYearly: averageRentYearly,
      newBuildPrice: this.property.newBuildPrice,
      depreciatedBuildPrice: this.property.depreciatedBuildPrice, 
      incomeYearly: this.incomeYearly,
      landToTotalRatio: this.property.landToTotalRatio,
      forecastParameters: this.forecastParameters,

      fairhold: new Fairhold({
        affordability: marketRent.affordability,
        landPriceOrRent: averageRentYearly,
      }), 

      marketPurchase: marketPurchase
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
        household: this,
        marketPurchase: this.tenure.marketPurchase,
        marketRent: this.tenure.marketRent,
        fairholdLandPurchase: this.tenure.fairholdLandPurchase,
        fairholdLandRent: this.tenure.fairholdLandRent,
        property: this.property,
        propertyPriceGrowthPerYear: params.forecastParameters.propertyPriceGrowthPerYear,
        constructionPriceGrowthPerYear: params.forecastParameters.constructionPriceGrowthPerYear,
        rentGrowthPerYear: params.forecastParameters.rentGrowthPerYear,
        yearsForecast: params.forecastParameters.yearsForecast,
        maintenanceLevel: params.forecastParameters.maintenanceLevel,
        incomeGrowthPerYear: params.forecastParameters.incomeGrowthPerYear,
        affordabilityThresholdIncomePercentage: params.forecastParameters.affordabilityThresholdIncomePercentage,
        incomeYearly: this.incomeYearly,
      };
      return new Lifetime(lifetimeParams);
    }

    private calculateGasDemand(params: ConstructorParams) {
      return {
        kwhExistingBuildYearly: this.calculateKwh(params, "existingBuild"),
        kwhNewBuildOrRetrofitYearly: this.calculateKwh(params, "newBuild"),
        billExistingBuildYearly: this.calculateGasBill("existingBuild"),
        billNewBuildOrRetrofitYearly: this.calculateGasBill("newBuild")
      }
      }

    private calculateKwh(params: ConstructorParams, newOrExisting: string) {
      const kwhM2 = newOrExisting === "existingBuild" ? KWH_M2_YR_EXISTING_BUILDS : KWH_M2_YR_NEWBUILDS_RETROFIT
      const kwhYearly = params.property.size * kwhM2[params.property.houseType]
      return kwhYearly
    }
    
    private calculateGasBill(newOrExisting: string) {
      const kwhYearly = newOrExisting === "existingBuild" ? this.gasDemand.kwhExistingBuildYearly : this.gasDemand.kwhNewBuildOrRetrofitYearly
      const gasBillExistingBuildYearly = this.kwhCostPence * kwhYearly / 100
      return gasBillExistingBuildYearly
    }

    private calculateGasBillNewBuildOrRetrofit() {
      const gasBillNewBuildOrRetrofitYearly = this.kwhCostPence * this.gasDemand.kwhNewBuildOrRetrofitYearly / 100
      return gasBillNewBuildOrRetrofitYearly
    }
  }