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

export type Results = Record<Exclude<keyof RawResults, 'id'>, {
    answer: string | string[] | undefined;
    value: number;
}[]>

export type SurveyData = {
    numberResponses: number;
    results: Results;
}

export type TickProps = {
    textAnchor: string;
    verticalAnchor: string;
    orientation: string;
    width: number;
    height: number;
    fontSize: number;
    x: number;
    y: number;
    className: string;
    stroke: string;
    fill: string;
    index: number;
    payload: {
        coordinate: number;
        value: string;
        index: number;
        offset: number;
    },
    visibleTicksCount: number;
}