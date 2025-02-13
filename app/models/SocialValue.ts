import { DEFAULT_FORECAST_PARAMETERS } from "./ForecastParameters";
import { Household } from "./Household"
import { KG_CO2_PER_KWH, 
    NHS_SAVINGS_PER_HOUSE_PER_YEAR, 
    SOCIAL_SAVINGS_PER_HOUSE_PER_YEAR, 
    FTE_SPEND, 
    SOCIAL_VALUE_YEARS,
    EMBODIED_CARBON_BRICK_BLOCK_KG_M2,
    EMBODIED_CARBON_TIMBER_SLAB_KG_M2
} from "./constants";

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
        this.embodiedCarbonSavings = this.calculateEmbodiedCarbonSaved(params)
        this.savingsEnergyPoundsYearly = this.calculateSavingsEnergyPoundsYearly(params);
        this.savingsToNHSPerHouseYearly = NHS_SAVINGS_PER_HOUSE_PER_YEAR;
        this.savingsToSocietyPerHouseYearly = SOCIAL_SAVINGS_PER_HOUSE_PER_YEAR;
        this.localJobs = this.calculateLocalJobsSupported(params);
        this.operationalCarbonSavingsYearly = this.calculateCarbonSavingsYearly(params);
    }

    private calculateMoneySavedFHLP(params: ConstructorParams) {
        const finalYear = DEFAULT_FORECAST_PARAMETERS.yearsForecast - 1
        const lifetime = params.household.lifetime.lifetimeData
        const marketPurchaseTotal = lifetime[finalYear].cumulativeCosts.marketPurchase
        const fairholdLandPurchaseTotal = lifetime[finalYear].cumulativeCosts.fairholdLandPurchase
        const moneySaved = marketPurchaseTotal - fairholdLandPurchaseTotal

        return moneySaved;
    }
    private calculateCommunityWealth(params: ConstructorParams) {
        const lifetime = params.household.lifetime.lifetimeData
        let communityWealth = 0
        for (let i = 0; i < SOCIAL_VALUE_YEARS; i++) { // TODO: decide on time period
            communityWealth += lifetime[i].fairholdLandRentCGRYearly
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

    private calculateEmbodiedCarbonSaved(params: ConstructorParams) {
        const houseSizeM2 = params.household.property.size
        const embodiedCarbonSavedTco2e = 
            ((EMBODIED_CARBON_BRICK_BLOCK_KG_M2 * houseSizeM2) - (EMBODIED_CARBON_TIMBER_SLAB_KG_M2 * houseSizeM2))
            / 1000
        return embodiedCarbonSavedTco2e
    }
}