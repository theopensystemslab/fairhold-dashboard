import { Household } from "./Household"
import { MarketPurchase } from "./tenure/MarketPurchase";
import { MarketRent } from "./tenure/MarketRent";
import { FairholdLandPurchase } from "./tenure/FairholdLandPurchase";
import { FairholdLandRent } from "./tenure/FairholdLandRent";
import { Fairhold } from "./Fairhold";
import { Property } from "./Property";
import { MONTHS_PER_YEAR, MAINTENANCE_LEVELS, MaintenanceLevel } from "./constants";

export interface LifetimeParams {
    household: Household;
    marketPurchase: MarketPurchase;
    marketRent: MarketRent;
    fairholdLandPurchase: FairholdLandPurchase;
    fairholdLandRent: FairholdLandRent;
    property: Property;
    propertyPriceGrowthPerYear: number;
    constructionPriceGrowthPerYear: number;
    rentGrowthPerYear: number;
    yearsForecast: number;
    maintenanceLevel: MaintenanceLevel;
    incomeGrowthPerYear: number;
    affordabilityThresholdIncomePercentage: number;
    incomeYearly: number;
}

export interface MaintenanceCosts {
    low: number;
    medium: number;
    high: number;
}

export interface DepreciatedHouseByMaintenanceLevel {
    none: number;
    low: number;
    medium: number;
    high: number;
}
export interface LifetimeData {
    incomeYearly: number;
    affordabilityThresholdIncome: number;
    newbuildHouseMortgageYearly: number;
    depreciatedHouseMortgageYearly: number;
    fairholdLandMortgageYearly: number;
    marketLandMortgageYearly: number;
    fairholdLandRentYearly: number;
    maintenanceCost: MaintenanceCosts;
    marketLandRentYearly: number;
    marketHouseRentYearly: number;
    gasBillExistingBuildYearly: number;
    gasBillNewBuildOrRetrofitYearly: number;
    depreciatedHouseResaleValue: DepreciatedHouseByMaintenanceLevel;
    fairholdLandPurchaseResaleValue: number;
    socialRentMonthlyLand: number;
    socialRentMonthlyHouse: number;
    houseAge: number;
    [key: number]: number;
}
/** 
 * The `Lifetime` class calculates yearly spend on housing over a lifetime (set by `yearsForecast`).
 * Instead of storing lifetime data within each tenure class itself,
 * `Lifetime` is stored in its own class (to prevent excess duplication of properties like `incomeYearly`).
 */
export class Lifetime {
    public lifetimeData: LifetimeData[];

    constructor(params: LifetimeParams) {
        this.lifetimeData = this.calculateLifetime(params);
    }
    
    /**
     * The `calculateLifetime` method creates an array and populates it with instances of the `LifetimeData` object.
     * It initialises all variables (except for the mortgage values) using values from `params`, before iterating on them in a `for` loop.
     * The mortgages are initialised as empty variables and then given values in a `for` loop that ensures that the year is within the `mortgageTerm`
     * @param params 
     * @returns 
     */
    private calculateLifetime(params: LifetimeParams): LifetimeData[] {
        const lifetime: LifetimeData[] = [];
        /** Increases yearly by `ForecastParameters.incomeGrowthPerYear`*/
        let incomeYearlyIterative = params.incomeYearly;
        /** 35% (or the value of `affordabilityThresholdIncomePercentage`) multiplied by `incomeYearly`*/
        let affordabilityThresholdIncomeIterative =
            incomeYearlyIterative * params.affordabilityThresholdIncomePercentage;
        /** Increases yearly by `ForecastParameters.propertyPriceGrowthPerYear`*/
        let averageMarketPriceIterative = params.property.averageMarketPrice;
        /** Increases yearly by `ForecastParameters.constructionPriceGrowthPerYear`*/
        let newBuildPriceIterative = params.property.newBuildPrice;
        /** Divides `landPrice` by `averageMarketPrice` anew each year as they appreciate */
        let landToTotalRatioIterative = 
            params.property.landPrice / params.property.averageMarketPrice;
        /** Subtracts `newBuildPriceIterative` from `averageMarketPriceIterative` */
        let landPriceIterative = params.property.landPrice;
        /** Increases yearly by `ForecastParameters.rentGrowthPerYear`*/
        let marketRentYearlyIterative = 
            params.marketRent.averageRentMonthly * MONTHS_PER_YEAR;
        /** Increases yearly by `ForecastParameters.rentGrowthPerYear`*/
        let marketRentAffordabilityIterative = 
            marketRentYearlyIterative / incomeYearlyIterative
        /** Uses the `landToTotalRatioIterative` to calculate the percentage of market rent that goes towards land as the market inflates */
        let marketRentLandYearlyIterative =
            marketRentYearlyIterative * landToTotalRatioIterative;
        /** Subtracts `marketRentLandYearlyIterative` from inflating `marketRentYearlyIterative` */
        let marketRentHouseYearlyIterative =
            marketRentYearlyIterative - marketRentLandYearlyIterative;
        /** The percentage levels are kept steady, and are multiplied by the `newBuildPriceIterative` as it inflates  */
        let maintenanceCostLowIterative = 
            MAINTENANCE_LEVELS.low * newBuildPriceIterative;
        let maintenanceCostMediumIterative = 
            MAINTENANCE_LEVELS.medium * newBuildPriceIterative;
        let maintenanceCostHighIterative = 
            MAINTENANCE_LEVELS.high * newBuildPriceIterative;
        /** Each loop a new `Property` instance is created, this is updated by running the `calculateDepreciatedBuildPrice()` method on `iterativeProperty` */
        let depreciatedHouseResaleValueNoMaintenanceIterative = params.property.depreciatedBuildPrice;
        let depreciatedHouseResaleValueLowMaintenanceIterative = params.property.depreciatedBuildPrice;
        let depreciatedHouseResaleValueMediumMaintenanceIterative = params.property.depreciatedBuildPrice;
        let depreciatedHouseResaleValueHighMaintenanceIterative = params.property.depreciatedBuildPrice;

        /** Resale value increases with `ForecastParameters.constructionPriceGrowthPerYear` */
        let fairholdLandPurchaseResaleValueIterative = params.fairholdLandPurchase.discountedLandPrice;
        let socialRentMonthlyLandIterative = params.household.tenure.socialRent.socialRentMonthlyLand; 
        let socialRentMonthlyHouseIterative = params.household.tenure.socialRent.socialRentMonthlyHouse;
        
        /** Initialises as user input house age and increments by one */
        let houseAgeIterative = params.property.age;

        let gasBillExistingBuildIterative = params.household.gasBillExistingBuildYearly;
        let gasBillNewBuildOrRetrofitIterative = params.household.gasBillNewBuildOrRetrofitYearly;

        // Initialise mortgage variables
        /** Assuming a constant interest rate, this figures stays the same until the mortgage term (`marketPurchase.houseMortgage.termYears`) is reached */
        let newbuildHouseMortgageYearlyIterative = params.marketPurchase.houseMortgage.yearlyPaymentBreakdown[0].yearlyPayment;
        /** Assuming a constant interest rate, this figures stays the same until the mortgage term (`marketPurchase.houseMortgage.termYears`) is reached. `termyears` is the same across tenures, so it doesn't matter that it comes from a `marketPurchase` object here */ 
        let depreciatedHouseMortgageYearlyIterative = params.fairholdLandPurchase.depreciatedHouseMortgage.yearlyPaymentBreakdown[0].yearlyPayment;
        /** Assuming a constant interest rate, this figures stays the same until the mortgage term (`marketPurchase.houseMortgage.termYears`) is reached. `termyears` is the same across tenures, so it doesn't matter that it comes from a `marketPurchase` object here */ 
        let fairholdLandMortgageYearlyIterative = params.fairholdLandPurchase.discountedLandMortgage.yearlyPaymentBreakdown[0].yearlyPayment;
        /** Assuming a constant interest rate, this figures stays the same until the mortgage term (`marketPurchase.houseMortgage.termYears`) is reached. `termyears` is the same across tenures, so it doesn't matter that it comes from a `marketPurchase` object here */ 
        let marketLandMortgageYearlyIterative = params.marketPurchase.landMortgage.yearlyPaymentBreakdown[0].yearlyPayment;
       
        // New instance of FairholdLandRent class
        let fairholdLandRentIterative = new Fairhold({
            affordability: marketRentAffordabilityIterative,
            landPriceOrRent: marketRentLandYearlyIterative,
        }).discountedLandPriceOrRent;

        // Push the Y0 values before they start being iterated-upon
        lifetime.push({
            incomeYearly: incomeYearlyIterative,
            affordabilityThresholdIncome: affordabilityThresholdIncomeIterative,
            newbuildHouseMortgageYearly: newbuildHouseMortgageYearlyIterative,
            depreciatedHouseMortgageYearly: depreciatedHouseMortgageYearlyIterative,
            fairholdLandMortgageYearly: fairholdLandMortgageYearlyIterative,
            marketLandMortgageYearly: marketLandMortgageYearlyIterative,
            fairholdLandRentYearly: fairholdLandRentIterative,
            maintenanceCost: {
                low: maintenanceCostLowIterative,
                medium: maintenanceCostMediumIterative,
                high: maintenanceCostHighIterative
            },
            marketLandRentYearly: marketRentLandYearlyIterative,
            marketHouseRentYearly: marketRentHouseYearlyIterative,
            depreciatedHouseResaleValue: {
                none: depreciatedHouseResaleValueNoMaintenanceIterative,
                low: depreciatedHouseResaleValueLowMaintenanceIterative,
                medium: depreciatedHouseResaleValueMediumMaintenanceIterative,
                high: depreciatedHouseResaleValueHighMaintenanceIterative
            },
            fairholdLandPurchaseResaleValue: fairholdLandPurchaseResaleValueIterative,
            socialRentMonthlyHouse: socialRentMonthlyHouseIterative,
            socialRentMonthlyLand: socialRentMonthlyLandIterative,
            houseAge: houseAgeIterative,
            gasBillExistingBuildYearly: gasBillExistingBuildIterative,
            gasBillNewBuildOrRetrofitYearly: gasBillNewBuildOrRetrofitIterative
        });

        // The 0th round has already been calculated and pushed above
        for (let i = 1; i <= params.yearsForecast - 1; i++) {
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
            maintenanceCostLowIterative =
                MAINTENANCE_LEVELS.low * newBuildPriceIterative;
            maintenanceCostMediumIterative =
                MAINTENANCE_LEVELS.medium * newBuildPriceIterative;
            maintenanceCostHighIterative =
                MAINTENANCE_LEVELS.high * newBuildPriceIterative;
            gasBillExistingBuildIterative = 
                gasBillExistingBuildIterative * (1 + params.constructionPriceGrowthPerYear) // TODO: when other branch merged, should be CPI
            gasBillNewBuildOrRetrofitIterative = 
                gasBillNewBuildOrRetrofitIterative * (1 + params.constructionPriceGrowthPerYear)
            
            /** 
             * A new instance of the `Property` class is needed each loop in order to
            re-calculate the depreciated house value as the house gets older
            */
            const iterativePropertyNoMaintenance = new Property({ 
                ...params.property,
                age: houseAgeIterative,
                maintenanceLevel: "none"
            });
            const iterativePropertyLowMaintenance = new Property({ 
                ...params.property,
                age: houseAgeIterative,
                maintenanceLevel: "low" 
            });
            const iterativePropertyMediumMaintenance = new Property({ 
                ...params.property,
                age: houseAgeIterative, 
                maintenanceLevel: "medium"
            });
            const iterativePropertyHighMaintenance = new Property({ 
                ...params.property,
                age: houseAgeIterative, 
                maintenanceLevel: "high"
            });
            /* Use the `calculateDepreciatedBuildPrice()` method on the new `Property` class 
            to calculate an updated depreciated house value */
            depreciatedHouseResaleValueNoMaintenanceIterative = iterativePropertyNoMaintenance.calculateDepreciatedBuildPrice()            
            depreciatedHouseResaleValueLowMaintenanceIterative = iterativePropertyLowMaintenance.calculateDepreciatedBuildPrice()            
            depreciatedHouseResaleValueMediumMaintenanceIterative = iterativePropertyMediumMaintenance.calculateDepreciatedBuildPrice()            
            depreciatedHouseResaleValueHighMaintenanceIterative = iterativePropertyHighMaintenance.calculateDepreciatedBuildPrice()            

            fairholdLandPurchaseResaleValueIterative = fairholdLandPurchaseResaleValueIterative * (1 + params.constructionPriceGrowthPerYear) // TODO: replace variable name with cpiGrowthPerYear
            houseAgeIterative += 1

            // If the mortgage term ongoing (if `i` is less than the term), calculate yearly mortgage payments
            if (i < params.marketPurchase.houseMortgage.termYears - 1) {
                newbuildHouseMortgageYearlyIterative = params.marketPurchase.houseMortgage.yearlyPaymentBreakdown[i].yearlyPayment;
                depreciatedHouseMortgageYearlyIterative = params.fairholdLandPurchase.depreciatedHouseMortgage.yearlyPaymentBreakdown[i].yearlyPayment;
                fairholdLandMortgageYearlyIterative = params.fairholdLandPurchase.discountedLandMortgage.yearlyPaymentBreakdown[i].yearlyPayment
                marketLandMortgageYearlyIterative = params.marketPurchase.landMortgage.yearlyPaymentBreakdown[i].yearlyPayment;
            // If the mortgage term has ended, yearly payment is 0
            } else {
                newbuildHouseMortgageYearlyIterative = 0;
                depreciatedHouseMortgageYearlyIterative = 0;
                fairholdLandMortgageYearlyIterative = 0;
                marketLandMortgageYearlyIterative = 0;
            }

            /* A new instance of the Fairhold class is needed in each loop in order to
            re-calculate land rent values per-year (with updating local house prices
            and income levels)*/
            fairholdLandRentIterative = new Fairhold({
                affordability: marketRentAffordabilityIterative,
                landPriceOrRent: marketRentLandYearlyIterative,
            }).discountedLandPriceOrRent;

            // Increase monthly social rent by the average inflation adjustment (2.83%)
            socialRentMonthlyHouseIterative *= 1.0283;
            socialRentMonthlyLandIterative *= 1.0283;
            
            lifetime.push({
                incomeYearly: incomeYearlyIterative,
                affordabilityThresholdIncome: affordabilityThresholdIncomeIterative,
                newbuildHouseMortgageYearly: newbuildHouseMortgageYearlyIterative,
                depreciatedHouseMortgageYearly: depreciatedHouseMortgageYearlyIterative,
                fairholdLandMortgageYearly: fairholdLandMortgageYearlyIterative,
                marketLandMortgageYearly: marketLandMortgageYearlyIterative,
                fairholdLandRentYearly: fairholdLandRentIterative,
                maintenanceCost: {
                    low: maintenanceCostLowIterative,
                    medium: maintenanceCostMediumIterative,
                    high: maintenanceCostHighIterative
                },
                marketLandRentYearly: marketRentLandYearlyIterative,
                marketHouseRentYearly: marketRentHouseYearlyIterative,
                depreciatedHouseResaleValue: {
                    none: depreciatedHouseResaleValueNoMaintenanceIterative,
                    low: depreciatedHouseResaleValueLowMaintenanceIterative,
                    medium: depreciatedHouseResaleValueMediumMaintenanceIterative,
                    high: depreciatedHouseResaleValueHighMaintenanceIterative
                },
                fairholdLandPurchaseResaleValue: fairholdLandPurchaseResaleValueIterative,
                socialRentMonthlyHouse: socialRentMonthlyHouseIterative,
                socialRentMonthlyLand: socialRentMonthlyLandIterative,
                houseAge: houseAgeIterative,
                gasBillExistingBuildYearly: gasBillExistingBuildIterative,
                gasBillNewBuildOrRetrofitYearly: gasBillNewBuildOrRetrofitIterative
            });
        }
        return lifetime;
    }
};