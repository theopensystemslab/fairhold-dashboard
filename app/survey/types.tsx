export type RawResults = {
    id: string;
    uk: string;
    nonUk: string;
    postcode: string;
    ageGroup: string;
    houseType: string;
    currentTenure: string;
    ownershipModel?: string;
    rentalModel?: string;
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

export type BarOrPieResults = Record<Exclude<keyof RawResults, 'id' | 'houseType' | 'idealHouseType' | 'liveWith' | 'idealLiveWith' | 'currentTenure' | 'currentMeansTenureChoice' | 'anyMeansTenureChoice'>, {
    answer: string | string[] | undefined;
    value: number;
}[]>

export type SankeyResults = Record<Extract<keyof RawResults, 'houseType' | 'liveWith' | 'currentMeansTenureChoice' | 'anyMeansTenureChoice'>, {
    nodes: {
        name: string
    }[]
    links: {
        source: number;
        target: number;
        value: number;
    }[]
}[]>

export type SurveyResults = {
    numberResponses: number;
    barOrPie: BarOrPieResults;
    sankey: SankeyResults;
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
