import { Household } from "./Household"
import { KG_CO2_PER_KWH, NHS_SAVINGS_PER_HOUSE_PER_YEAR, SOCIAL_SAVINGS_PER_HOUSE_PER_YEAR, FTE_SPEND, SOCIAL_VALUE_YEARS } from "./constants";

type ConstructorParams = {
    household: Household
};


export class SocialValue {
    public moneySaved: number;
    public communityWealthDecade: number;
    public embodiedCarbonSavings: number;
    public savingsEnergyPoundsYearly: number;
    public savingsToNHSPerHouseYearly: number;
    public savingsToSocietyPerHouseYearly: number;
    public localJobs: number;
    public operationalCarbonSavingsYearly: number;

    constructor(params: ConstructorParams) {
        this.moneySaved = this.calculateMoneySavedFHLP(params);
        this.communityWealthDecade = this.calculateCommunityWealth(params);
        this.embodiedCarbonSavings = 31.89; // TODO: update figures, not placing in constants.ts because it's placeholder; static number comparing average brick & block emissions vs. timber on slab
        this.savingsEnergyPoundsYearly = this.calculateSavingsEnergyPoundsYearly(params);
        this.savingsToNHSPerHouseYearly = NHS_SAVINGS_PER_HOUSE_PER_YEAR;
        this.savingsToSocietyPerHouseYearly = SOCIAL_SAVINGS_PER_HOUSE_PER_YEAR;
        this.localJobs = this.calculateLocalJobsSupported(params);
        this.operationalCarbonSavingsYearly = this.calculateCarbonSavingsYearly(params);
    }

    private calculateMoneySavedFHLP(params: ConstructorParams) {
        let marketPurchaseTotal = 0;
        let fairholdLandPurchaseTotal = 0;
        const lifetime = params.household.lifetime.lifetimeData
        for (let i = 0; i < 10; i++) { // TODO: should this include bills? TODO: do we want to show 10 years only? using 10 here because designs showed savings over 10 year period, not lifetime
            marketPurchaseTotal += (lifetime[i].marketLandMortgageYearly + lifetime[i].newbuildHouseMortgageYearly)
            fairholdLandPurchaseTotal += (lifetime[i].fairholdLandMortgageYearly + lifetime[i].depreciatedHouseMortgageYearly)
        }
        const moneySaved = marketPurchaseTotal - fairholdLandPurchaseTotal
        return moneySaved;
    }
    private calculateCommunityWealth(params: ConstructorParams) {
        const lifetime = params.household.lifetime.lifetimeData
        let communityWealth = 0
        for (let i = 0; i < SOCIAL_VALUE_YEARS; i++) { // TODO: decide on time period
            communityWealth += lifetime[i].fairholdLandRentYearly
        }
        return communityWealth;
    }
    private calculateSavingsEnergyPoundsYearly(params: ConstructorParams) {
        const gasBillSavings = params.household.gasDemand.billExistingBuildYearly - params.household.gasDemand.billNewBuildOrRetrofitYearly
        return gasBillSavings;
    }
    // private calculateLocalEconomyBoost(params) {}
    private calculateCarbonSavingsYearly(params: ConstructorParams) {
        const operationalEmissionsExistingBuild = KG_CO2_PER_KWH * params.household.gasDemand.kwhExistingBuildYearly
        const operationalEmissionsNewBuildOrRetrofit = KG_CO2_PER_KWH * params.household.gasDemand.kwhNewBuildOrRetrofitYearly
        const operationalEmissionsSavedTCo2e = (operationalEmissionsExistingBuild - operationalEmissionsNewBuildOrRetrofit) / 1000
        return operationalEmissionsSavedTCo2e
    }

    private calculateLocalJobsSupported(params: ConstructorParams) {
        const maintenanceLevel = params.household.property.maintenanceLevel
        const totalSpend = params.household.property.newBuildPrice + params.household.lifetime.lifetimeData[0].maintenanceCost[maintenanceLevel]
        let jobsSupported = totalSpend / FTE_SPEND
        jobsSupported = parseFloat(jobsSupported.toFixed(1));
        return jobsSupported
    }
}