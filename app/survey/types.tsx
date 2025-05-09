export type RawResults = {
    id: string;
    uk: string;
    nonUk: string;
    postcode: string;
    ageGroup: string;
    houseType: string;
    currentTenure: string;
    ownershipModel?: string | undefined;
    rentalModel?: string | undefined;
    liveWith: string;
    secondHomes: string;
    idealHouseType: string;
    idealLiveWith: string;
    housingOutcomes: string[];
    fairholdCalculator: string;
    affordFairhold: string;
    currentMeansTenureChoice: string;
    whyFairhold?: string[];
    whyNotFairhold?: string[];
    anyMeansTenureChoice: string[];
    supportDevelopment: string;
    supportDevelopmentFactors: string[];
    supportNewFairhold: string;
};

export type Results = Record<keyof RawResults, {
    name: string | string[] | null | undefined;
    value: number;
}[]>

export type SurveyData = {
    numberResponses: number;
    results: Results;
}