import { Household } from "./Household"
import { MarketPurchase } from "./tenure/MarketPurchase";
import { MarketRent } from "./tenure/MarketRent";
import { FairholdLandPurchase } from "./tenure/FairholdLandPurchase";
import { FairholdLandRent } from "./tenure/FairholdLandRent";
import { Fairhold } from "./Fairhold";
import { Property } from "./Property";
import { MONTHS_PER_YEAR, MAINTENANCE_LEVELS, MaintenanceLevel, SOCIAL_RENT_ADJUSTMENT_FORECAST } from "./constants";
import type { MortgageBreakdownElement } from "./Mortgage"

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
    incomeYearly: number;
}

export interface MaintenanceCosts {
    none: 0;
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

type LifetimeMortgageBreakdown = Pick<MortgageBreakdownElement, "yearlyInterestPaid" | "yearlyEquityPaid">
export interface LifetimeData {
    incomeYearly: number;
    marketPurchaseYearly: LifetimeMortgageBreakdown;
    fairholdLandPurchaseYearly: LifetimeMortgageBreakdown;
    fairholdLandRentYearly: LifetimeMortgageBreakdown;
    fairholdLandRentCGRYearly: number;
    maintenanceCost: MaintenanceCosts;
    /** While our graph doesn't split rent values into land and house, this is still used as an input into Fairhold Land Rent calcs */
    marketRentLandYearly: number;
    marketRentYearly: number;
    gasBillExistingBuildYearly: number;
    gasBillNewBuildOrRetrofitYearly: number;
    depreciatedHouseResaleValue: DepreciatedHouseByMaintenanceLevel;
    fairholdLandPurchaseResaleValue: number;
    socialRentYearly: number;
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
        /** 
         * We need this figure as an input to calculate`FairholdLandRent`
         * Uses the `landToTotalRatioIterative` to calculate the percentage of market rent that goes towards land as the market inflates */
        let marketRentLandYearlyIterative =
            marketRentYearlyIterative * landToTotalRatioIterative;
        /* The percentage levels are kept steady, and are multiplied by the `newBuildPriceIterative` as it inflates  */
        let maintenanceCostLowIterative = 
            MAINTENANCE_LEVELS.low * newBuildPriceIterative;
        let maintenanceCostMediumIterative = 
            MAINTENANCE_LEVELS.medium * newBuildPriceIterative;
        let maintenanceCostHighIterative = 
            MAINTENANCE_LEVELS.high * newBuildPriceIterative;
        /* Each loop a new `Property` instance is created, this is updated by running the `calculateDepreciatedBuildPrice()` method on `iterativeProperty` */
        let depreciatedHouseResaleValueNoMaintenanceIterative = params.property.depreciatedBuildPrice;
        let depreciatedHouseResaleValueLowMaintenanceIterative = params.property.depreciatedBuildPrice;
        let depreciatedHouseResaleValueMediumMaintenanceIterative = params.property.depreciatedBuildPrice;
        let depreciatedHouseResaleValueHighMaintenanceIterative = params.property.depreciatedBuildPrice;

        /** Resale value increases with `ForecastParameters.constructionPriceGrowthPerYear` */
        let fairholdLandPurchaseResaleValueIterative = params.fairholdLandPurchase.discountedLandPrice;
        let socialRentYearlyIterative = (params.household.tenure.socialRent.socialRentMonthlyLand + params.household.tenure.socialRent.socialRentMonthlyHouse) * 12; 
        
        /** Initialises as user input house age and increments by one */
        let houseAgeIterative = params.property.age;

        let gasBillExistingBuildIterative = params.household.gasDemand.billExistingBuildYearly;
        let gasBillNewBuildOrRetrofitIterative = params.household.gasDemand.billNewBuildOrRetrofitYearly;
       
        // New instance of FairholdLandRent class
        let fairholdLandRentCGRYearlyIterative = new Fairhold({
            affordability: marketRentAffordabilityIterative,
            landPriceOrRent: marketRentLandYearlyIterative,
        }).discountedLandPriceOrRent;

        // Initialise LifetimeMortgageBreakdown
        let marketPurchaseYearlyIterative = this.getMortgageBreakdown("marketPurchase", params.household, 0)
        let fairholdLandPurchaseYearlyIterative = this.getMortgageBreakdown("fairholdLandPurchase", params.household, 0)
        let fairholdLandRentYearlyIterative = this.getMortgageBreakdown("fairholdLandRent", params.household, 0)

        // Push the Y0 values before they start being iterated-upon
        lifetime.push({
            incomeYearly: incomeYearlyIterative,
            marketPurchaseYearly: marketPurchaseYearlyIterative,
            fairholdLandPurchaseYearly: fairholdLandPurchaseYearlyIterative,
            fairholdLandRentYearly: fairholdLandRentYearlyIterative,
            fairholdLandRentCGRYearly: fairholdLandRentCGRYearlyIterative,
            maintenanceCost: {
                none: 0,
                low: maintenanceCostLowIterative,
                medium: maintenanceCostMediumIterative,
                high: maintenanceCostHighIterative
            },
            marketRentYearly: marketRentYearlyIterative,
            marketRentLandYearly: marketRentLandYearlyIterative,
            depreciatedHouseResaleValue: {
                none: depreciatedHouseResaleValueNoMaintenanceIterative,
                low: depreciatedHouseResaleValueLowMaintenanceIterative,
                medium: depreciatedHouseResaleValueMediumMaintenanceIterative,
                high: depreciatedHouseResaleValueHighMaintenanceIterative
            },
            fairholdLandPurchaseResaleValue: fairholdLandPurchaseResaleValueIterative,
            socialRentYearly: socialRentYearlyIterative,
            houseAge: houseAgeIterative,
            gasBillExistingBuildYearly: gasBillExistingBuildIterative,
            gasBillNewBuildOrRetrofitYearly: gasBillNewBuildOrRetrofitIterative
        });

        // The 0th round has already been calculated and pushed above
        for (let i = 1; i <= params.yearsForecast - 1; i++) {
            incomeYearlyIterative = 
                incomeYearlyIterative * (1 + params.incomeGrowthPerYear);      
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
            
            /** A new instance of the `Property` class is needed each loop in order to re-calculate the depreciated house value as the house gets older */
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

            // If the mortgage term is ongoing (if `i` is less than the term), use yearly mortgage payments
            if (i < params.marketPurchase.houseMortgage.termYears - 1) {
                marketPurchaseYearlyIterative = this.getMortgageBreakdown("marketPurchase", params.household, i)
                fairholdLandPurchaseYearlyIterative = this.getMortgageBreakdown("fairholdLandPurchase", params.household, i)
                fairholdLandRentYearlyIterative = this.getMortgageBreakdown("fairholdLandRent", params.household, i)      
            // If the mortgage term has ended, yearly payment is 0
            } else {
                const noMortgage = {
                    yearlyInterestPaid: 0,
                    yearlyEquityPaid: 0
                }
                marketPurchaseYearlyIterative = noMortgage;
                fairholdLandPurchaseYearlyIterative = noMortgage;
                fairholdLandRentYearlyIterative = noMortgage;
            }

            /* A new instance of the Fairhold class is needed in each loop in order to
            re-calculate land rent values per-year (with updating local house prices
            and income levels)*/
            fairholdLandRentCGRYearlyIterative = new Fairhold({
                affordability: marketRentAffordabilityIterative,
                landPriceOrRent: marketRentLandYearlyIterative,
            }).discountedLandPriceOrRent;

            // Increase monthly social rent by the average inflation adjustment (2.83%)
            socialRentYearlyIterative *= SOCIAL_RENT_ADJUSTMENT_FORECAST;
            
            lifetime.push({
                incomeYearly: incomeYearlyIterative,
                marketPurchaseYearly: marketPurchaseYearlyIterative,
                fairholdLandPurchaseYearly: fairholdLandPurchaseYearlyIterative,
                fairholdLandRentYearly: fairholdLandRentYearlyIterative,
                fairholdLandRentCGRYearly: fairholdLandRentCGRYearlyIterative,
                maintenanceCost: {
                    none: 0,
                    low: maintenanceCostLowIterative,
                    medium: maintenanceCostMediumIterative,
                    high: maintenanceCostHighIterative
                },
                marketRentLandYearly: marketRentLandYearlyIterative,
                marketRentYearly: marketRentYearlyIterative,
                gasBillExistingBuildYearly: gasBillExistingBuildIterative,
                gasBillNewBuildOrRetrofitYearly: gasBillNewBuildOrRetrofitIterative,
                depreciatedHouseResaleValue: {
                    none: depreciatedHouseResaleValueNoMaintenanceIterative,
                    low: depreciatedHouseResaleValueLowMaintenanceIterative,
                    medium: depreciatedHouseResaleValueMediumMaintenanceIterative,
                    high: depreciatedHouseResaleValueHighMaintenanceIterative
                },
                fairholdLandPurchaseResaleValue: fairholdLandPurchaseResaleValueIterative,
                socialRentYearly: socialRentYearlyIterative,
                houseAge: houseAgeIterative,
            });
        }
        return lifetime;
    }

    private getMortgageBreakdown(
        tenure: "marketPurchase" | "fairholdLandPurchase" | "fairholdLandRent",
        params: Household,
        year: number
      ): LifetimeMortgageBreakdown {
        const lifetimeMortgageBreakdown = {
            yearlyInterestPaid: 0,
            yearlyEquityPaid: 0,
        }
        // Handle different property names based on tenure type. No need to deal with mortgage term here; it is handled in the Lifetime constructor instead
        if (tenure === "marketPurchase") {
            const landMortgageYearly = params.tenure.marketPurchase.landMortgage.yearlyPaymentBreakdown[year]
            const houseMortgageYearly = params.tenure.marketPurchase.houseMortgage.yearlyPaymentBreakdown[year]

            lifetimeMortgageBreakdown.yearlyInterestPaid = landMortgageYearly.yearlyInterestPaid + houseMortgageYearly.yearlyInterestPaid
            lifetimeMortgageBreakdown.yearlyEquityPaid = landMortgageYearly.yearlyEquityPaid + houseMortgageYearly.yearlyEquityPaid
        }
        if (tenure === "fairholdLandPurchase") {
            const landMortgageYearly = params.tenure.fairholdLandPurchase.discountedLandMortgage.yearlyPaymentBreakdown[year]
            const houseMortgageYearly = params.tenure.fairholdLandPurchase.depreciatedHouseMortgage.yearlyPaymentBreakdown[year]

            lifetimeMortgageBreakdown.yearlyInterestPaid = landMortgageYearly.yearlyInterestPaid + houseMortgageYearly.yearlyInterestPaid
            lifetimeMortgageBreakdown.yearlyEquityPaid = landMortgageYearly.yearlyEquityPaid + houseMortgageYearly.yearlyEquityPaid
        }
        if (tenure === "fairholdLandRent") {
            // FairholdLandRent only has house mortgage
            const houseMortgageYearly = params.tenure.fairholdLandRent.depreciatedHouseMortgage.yearlyPaymentBreakdown[year]

            lifetimeMortgageBreakdown.yearlyInterestPaid = houseMortgageYearly.yearlyInterestPaid 
            lifetimeMortgageBreakdown.yearlyEquityPaid = houseMortgageYearly.yearlyEquityPaid
        }
            return lifetimeMortgageBreakdown;
        }
    }