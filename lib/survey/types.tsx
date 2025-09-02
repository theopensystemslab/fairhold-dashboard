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

// These are excluded because they are either not relevant (eg id) or will be formatted separately to bar / pie results (eg houseType, idealHouseType)
type ExcludedRawResults =
    | "id"
    | "houseType"
    | "idealHouseType"
    | "liveWith"
    | "idealLiveWith"
    | "currentTenure"
    | "currentMeansTenureChoice";

type ResultKeys = Exclude<keyof RawResults, ExcludedRawResults>;

export type ResultGroupedByTenure = Record<string, BarOrPieResult[]>

// Mapped type to link input key without output shape
export type BarOrPieResults = {
    [K in ResultKeys]:
        K extends "housingOutcomes" ? ResultGroupedByTenure :
        BarOrPieResult[];
};

export type BarOrPieResult = {
    answer: string;
    value: number;
}

export type SankeyResults = Record<Extract<keyof RawResults, 
    'idealHouseType' | 
    'idealLiveWith' | 
    'currentMeansTenureChoice'
    >, 
    SankeyResult>

export type SankeyResult = {
    nodes: {
        name: string;
        label: string;
        color: string;
    }[]
    links: {
        source: number;
        target: number;
        value: number;
    }[]
}

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
