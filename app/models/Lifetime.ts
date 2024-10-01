// imports (eg constants)
import { MarketPurchase } from "./tenure/MarketPurchase";
import { MarketRent } from "./tenure/MarketRent";
import { FairholdLandPurchase } from "./tenure/FairholdLandPurchase";
import { FairholdLandRent } from "./tenure/FairholdLandRent";
import { Fairhold } from "./Fairhold";
import { Property } from "./Property";
import { MONTHS_PER_YEAR } from "./constants";

// interfaces and types
export interface LifetimeParams {
    marketPurchase: MarketPurchase;
    marketRent: MarketRent;
    fairholdLandPurchase: FairholdLandPurchase;
    fairholdLandRent: FairholdLandRent;
    property: Property;
    propertyPriceGrowthPerYear: number;
    constructionPriceGrowthPerYear: number;
    rentGrowthPerYear: number;
    yearsForecast: number;
    maintenanceCostPercentage: number;
    incomeGrowthPerYear: number;
    affordabilityThresholdIncomePercentage: number;
    incomeYearly: number;
    gasBillAdjustedYearly: number;
    gasBillRetrofitYearly: number;
}

export interface LifetimeData {
    incomeYearly: number;
    affordabilityThresholdIncome: number;
    newbuildHouseMortgageYearly: number;
    depreciatedHouseMortgageYearly: number;
    fairholdLandMortgageYearly: number;
    marketLandMortgageYearly: number;
    fairholdLandRentYearly: number;
    maintenanceCost: number;
    marketLandRentYearly: number;
    marketHouseRentYearly: number;
    gasBillAdjustedYearly: number;
    gasBillRetrofitYearly: number;
    [key: number]: number;
}

export class Lifetime {
    public lifetimeData: LifetimeData[];

    constructor(params: LifetimeParams) {
        this.lifetimeData = this.calculateLifetime(params);
    }
    
    private calculateLifetime(params: LifetimeParams): LifetimeData[] {
        const lifetime: LifetimeData[] = [];

        // // initialise properties; all properties with default value of 0 will be updated in the loop
        // this.incomeYearly = params.incomeYearly;
        // this.affordabilityThresholdIncome = params.incomeYearly * params.affordabilityThresholdIncomePercentage;
        // this.newbuildHouseMortgageYearly = 0; 
        // this.depreciatedHouseMortgageYearly = 0;
        // this.fairholdLandMortgageYearly = 0; 
        // this.marketLandMortgageYearly = 0; 
        // this.fairholdLandRentYearly = 0; 
        // this.maintenanceCost = params.property.newBuildPrice * params.maintenanceCostPercentage;
        // this.marketLandRentYearly = 0; 
        // this.marketHouseRentYearly = 0; 

        // initialise mortgage values
        let newbuildHouseMortgageYearlyIterative;
        let depreciatedHouseMortgageYearlyIterative;
        let fairholdLandMortgageYearlyIterative;
        let marketLandMortgageYearlyIterative;

        // initialise non-mortgage variables; 
        let incomeYearlyIterative = params.incomeYearly;
        let affordabilityThresholdIncomeIterative =
            incomeYearlyIterative * params.affordabilityThresholdIncomePercentage;
        let averageMarketPriceIterative = params.property.averageMarketPrice;
        let newBuildPriceIterative = params.property.newBuildPrice;
        let landToTotalRatioIterative = 
            params.property.landPrice / params.property.averageMarketPrice;
        let landPriceIterative = params.property.landPrice;
        let marketRentYearlyIterative = 
            params.marketRent.averageRentMonthly * MONTHS_PER_YEAR;
        let marketRentAffordabilityIterative = 
            marketRentYearlyIterative / incomeYearlyIterative
        let marketRentLandYearlyIterative =
            marketRentYearlyIterative * landToTotalRatioIterative;
        let marketRentHouseYearlyIterative =
            marketRentYearlyIterative - marketRentLandYearlyIterative;
        let maintenanceCostIterative = 
            params.maintenanceCostPercentage * newBuildPriceIterative;
        let gasBillAdjustedYearlyIterative = 
            params.gasBillAdjustedYearly;
        let gasBillRetrofitYearlyIterative = 
            params.gasBillRetrofitYearly;

        for (let i = 0; i < params.yearsForecast - 1; i++) {
            incomeYearlyIterative = 
                incomeYearlyIterative * (1 + params.incomeGrowthPerYear);
            affordabilityThresholdIncomeIterative =
                incomeYearlyIterative * params.affordabilityThresholdIncomePercentage;
            averageMarketPriceIterative =
                averageMarketPriceIterative * (1 + params.propertyPriceGrowthPerYear);
            newBuildPriceIterative =
              newBuildPriceIterative * (1 + params.constructionPriceGrowthPerYear);
            landToTotalRatioIterative = 
                landPriceIterative / averageMarketPriceIterative;
            landPriceIterative = 
                averageMarketPriceIterative - newBuildPriceIterative;
            marketRentYearlyIterative =
                marketRentYearlyIterative * (1 + params.rentGrowthPerYear);
            marketRentAffordabilityIterative = 
                marketRentYearlyIterative / incomeYearlyIterative
            marketRentLandYearlyIterative =
                marketRentYearlyIterative * landToTotalRatioIterative;
            marketRentHouseYearlyIterative =
                marketRentYearlyIterative - marketRentLandYearlyIterative;
            maintenanceCostIterative =
                newBuildPriceIterative * params.maintenanceCostPercentage;
            gasBillAdjustedYearlyIterative = 
                gasBillAdjustedYearlyIterative * (1 + params.constructionPriceGrowthPerYear);
            gasBillRetrofitYearlyIterative = 
                gasBillRetrofitYearlyIterative * (1 + params.constructionPriceGrowthPerYear);

            if (i < params.marketPurchase.houseMortgage.termYears - 1) {
                newbuildHouseMortgageYearlyIterative = params.marketPurchase.houseMortgage.yearlyPaymentBreakdown[i].yearlyPayment;
                depreciatedHouseMortgageYearlyIterative = params.fairholdLandPurchase.depreciatedHouseMortgage.yearlyPaymentBreakdown[i].yearlyPayment;
                fairholdLandMortgageYearlyIterative = params.fairholdLandPurchase.discountedLandMortgage.yearlyPaymentBreakdown[i].yearlyPayment
                marketLandMortgageYearlyIterative = params.marketPurchase.landMortgage.yearlyPaymentBreakdown[i].yearlyPayment;
            } else {
                newbuildHouseMortgageYearlyIterative = 0;
                depreciatedHouseMortgageYearlyIterative = 0;
                fairholdLandMortgageYearlyIterative = 0;
                marketLandMortgageYearlyIterative = 0;
            }

            /* A new instance of the Fairhold class is needed here in order to
            re-calculate land rent values per-year (with updating local house prices
            and income levels)*/
            const fairholdLandRentIterative = new Fairhold({
                affordability: marketRentAffordabilityIterative,
                landPriceOrRent: marketRentLandYearlyIterative,
            }).discountedLandPriceOrRent;
      
            lifetime.push({
                incomeYearly: incomeYearlyIterative,
                affordabilityThresholdIncome: affordabilityThresholdIncomeIterative,
                newbuildHouseMortgageYearly: newbuildHouseMortgageYearlyIterative,
                depreciatedHouseMortgageYearly: depreciatedHouseMortgageYearlyIterative,
                fairholdLandMortgageYearly: fairholdLandMortgageYearlyIterative,
                marketLandMortgageYearly: marketLandMortgageYearlyIterative,
                fairholdLandRentYearly: fairholdLandRentIterative,
                maintenanceCost: maintenanceCostIterative,
                marketLandRentYearly: marketRentLandYearlyIterative,
                marketHouseRentYearly: marketRentHouseYearlyIterative,
                gasBillAdjustedYearly: gasBillAdjustedYearlyIterative,
                gasBillRetrofitYearly: gasBillRetrofitYearlyIterative
            });
        }
        return lifetime;
    }
};