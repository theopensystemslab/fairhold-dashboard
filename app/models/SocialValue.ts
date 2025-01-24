import { Household } from "./Household"
// import { KG_CO2_PER_KWH, KWH_M2_YR_NEWBUILDS_RETROFIT } from "./constants";

type ConstructorParams = Household;

export class SocialValue {
    public moneySaved: number;
    public communityWealthDecade: number;
    public embodiedCarbonSavings: number;
    public savingsEnergyPoundsYearly: number;
    public savingsToNHSPerHeadYearly: number;
    public localEconomyBoost: number;
    public carbonSavingsYearly: number;

    constructor(params: ConstructorParams) {
        this.moneySaved = this.calculateMoneySavedFHLP(params);
        this.communityWealthDecade = this.calculateCommunityWealth(params);
        // TODO: can we update these by size? figures pulled from Clayton's sheet
        this.embodiedCarbonSavings = 31.89; // static number comparing average brick & block emissions vs. timber on slab
        this.savingsEnergyPoundsYearly = this.calculateSavingsEnergyPoundsYearly(params);
        this.savingsToNHSPerHeadYearly = 24.78
        this.localEconomyBoost = 1;
        this.carbonSavingsYearly = 1;
    }

    private calculateMoneySavedFHLP(params: Household) {
        let marketPurchaseTotal = 0;
        let fairholdLandPurchaseTotal = 0;
        const lifetime = params.lifetime.lifetimeData
        for (let i = 0; i < lifetime.length; i++) { // TODO: should this include bills? 
            marketPurchaseTotal += (lifetime[i].marketLandMortgageYearly + lifetime[i].newbuildHouseMortgageYearly)
            fairholdLandPurchaseTotal += (lifetime[i].fairholdLandMortgageYearly + lifetime[i].depreciatedHouseMortgageYearly)
        }
        const moneySaved = marketPurchaseTotal - fairholdLandPurchaseTotal
        return moneySaved;
    }
    private calculateCommunityWealth(params: Household) {
        const lifetime = params.lifetime.lifetimeData
        let communityWealth = 0
        for (let i = 0; i < 10; i++) { // TODO: decide on time period
            communityWealth += lifetime[i].fairholdLandRentYearly
        }
        return communityWealth;
    }
    private calculateSavingsEnergyPoundsYearly(params: Household) {
        const gasBillSavings = params.gasBillExistingBuildYearly - params.gasBillNewBuildOrRetrofitYearly
        return gasBillSavings;
    }
    // private calculateLocalEconomyBoost(params) {}
    // private calculateCarbonSavingsYearly(params) {
    //     const operationalEmissionsExisting = params.property.size * KWH_M2_YR_EXISTING_BUILDS[params.property.houseType]
    //     const operationalEmissionsNew = params.property.size * KWH_M2_YR_NEWBUILDS_RETROFIT[params.property.houseType]
    // }

}
// money saved
// community wealth
// embodied carbon savings
// energy savings (£)
// savings to NHS
// local economy
// annual carbon savings