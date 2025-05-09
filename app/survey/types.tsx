export type SurveyComponentProps = {
    results: FormattedSurveyResults;
}

export type SurveyResults = {
    id: string;
    uk: string;
    nonUk: string;
    postcode: string;
    ageGroup: string;
    houseType: string;
    currentTenure: string;
    ownershipModel?: string | null;
    rentalModel?: string | null;
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

export type FormattedSurveyResults = {
    affordFairhold: AffordFairholdResults; // doughnut
    age: AgeResults; // doughnut
    anyMeansTenureChoice: SankeyResults; // sankey
    country: CountryResults; // tbc
    currentMeansTenureChoice: SankeyResults; // sankey
    houseType: SankeyResults; // sankey
    housingOutcomes: HousingOutcomesResults; // bar 
    liveWith: SankeyResults; // sankey
    // postcode: ; 
    resultsCount: number;
    supportDevelopment: SupportDevelopmentResults; // doughnut
    supportDevelopmentFactors: SupportDevelopmentFactorsResults; // bar
    supportNewFairhold: SupportNewFairholdResults; // doughnut
};

export type SankeyResults =  {
    nodes: { name: string }[];
    links: { source: number; target: number; value: number }[];
};

export type AgeResults = [
    { name: "0-18"; value: number; },
    { name: "19-24"; value: number; },
    { name: "25-34"; value: number; },
    { name: "35-44"; value: number; },
    { name: "45-54"; value: number; },
    { name: "55-64"; value: number; },
    { name: "65+"; value: number; }
]

export type AffordFairholdResults = [
    { name: "Yes"; value: number;},
    { name: "Yes, but Fairhold Land Rent only, because the deposit is lower"; value: number;},
    { name: "No, it's still too expensive"; value: number;},
    { name: "I don't know"; value: number;}
]

export type CountryResults = {
    [key: string]: number;
}

export type HousingOutcomesResults = [
    { name: "Security from being evicted"; value: number;},
    { name: "Lower cost"; value: number;},
    { name: "Proximity to work"; value: number;},
    { name: "Proximity to friends and family"; value: number;},
    { name: "Proximity to good schools"; value: number;},
    { name: "To get my money back when I sell"; value: number;},
    { name: "To retire with low outgoings"; value: number;},
    { name: "Lower energy bills"; value: number;},
    { name: "Freedom to improve or repair my home myself"; value: number;},
    { name: "Home kept in good state of repair by others"; value: number;},
    { name: "Quality of space"; value: number;},
    { name: "More space"; value: number;},
    { name: "Sense of community / shared spaces within the neighbourhood"; value: number;},
    { name: "Better public transport connections"; value: number;},
    { name: "Walkable neighbourhood"; value: number;},
    { name: "Lower crime / antisocial behaviour"; value: number;},
    { name: "Being able to easily move home whenever I want to"; value: number;},
    { name: "My home to increase in value as an investment"; value: number;},
    { name: "Rent as a source of income"; value: number;},
    { name: "Freedom from stress or exploitation (for example, debt, maintenance responsibilities, toxic relationships, bad landlords, or exploitative management companies)"; value: number;},
    { name: "None of these. My current situation is fine."; value: number;},
    { name: "Other"; value: number;}
]

export type SupportDevelopmentResults = [
    { name: "Strongly supportive of any development"; value: number;},
    { name: "Quite supportive of most development"; value: number;},
    { name: "It depends"; value: number;},
    { name: "Quite opposed to most development"; value: number;},
    { name: "Strongly opposed to any development"; value: number;},
    { name: "Don't know"; value: number;}
]

export type SupportDevelopmentFactorsResults = [
    { name: "Homes that are affordable to keyworkers"; value: number;},
    { name: "Affordable tenure homes for low-income families"; value: number;},
    { name: "Priority given to local residents and their families (to allow downsizing, for example)"; value: number;},
    { name: "Community-led or self-build development (designed for people, not profit)"; value: number;},
    { name: "Council or social housing provider led (designed for people, not profit)"; value: number;},
    { name: "Beautiful design that complements and improves the local character"; value: number;},
    { name: "Traditional design, with a heritage character"; value: number;},
    { name: "Well-supported by new infrastructure (eg. public transport, schools, GPs, parks)"; value: number;},
    { name: "Walkable streets with trees and green spaces"; value: number;},
    { name: "Includes shops, cafés and community facilities"; value: number;},
    { name: "Small-scale development spread across the area"; value: number;},
    { name: "Infill development on gap sites, increasing the density of existing neighbourhoods"; value: number;},
    { name: "Only build new neighbourhoods on sites away from existing homes"; value: number;},
    { name: "Environmentally sustainable, zero-carbon homes, protecting biodiversity"; value: number;},
    { name: "Procured locally, sustaining local jobs"; value: number;},
    { name: "Includes a financial return for me and my family"; value: number;},
    { name: "Includes a financial return for the local community"; value: number;},
    { name: "No new build. We should only create new homes by converting existing buildings or bringing empty homes back into use."; value: number;},
    { name: "None of these, there shouldn't be any new homes"; value: number;},
    { name: "Other"; value: number;}
]

export type SupportNewFairholdResults = [
    { name: "Strongly support"; value: number;},
    { name: "Somewhat support"; value: number;},
    { name: "Neither support nor oppose"; value: number;},
    { name: "Somewhat oppose"; value: number;},
    { name: "Strongly oppose"; value: number;},
    { name: "Other"; value: number;},
]