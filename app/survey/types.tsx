export type SurveyComponentProps = {
    results: SurveyResults[];
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
    anyMeansTenureChoice: TenureChoiceResults; // sankey
    country: CountryResults; // tbc
    currentMeansTenureChoice: TenureChoiceResults; // sankey
    houseType: HouseTypeResults; // sankey
    housingOutcomes: HousingOutcomesResults; // bar 
    liveWith: LiveWithResults; // sankey
    // postcode: ; 
    supportDevelopment: SupportDevelopmentResults; // doughnut
    supportDevelopmentFactors: SupportDevelopmentFactorsResults; // bar
    supportNewFairhold: SupportNewFairholdResults; // doughnut
};

export type AgeResults = {
    "0-18": number;
    "19-24": number;
    "25-34": number;   
    "35-44": number;
    "45-54": number;
    "55-64": number;
    "65+": number;
}

export type AffordFairholdResults = {
    "Yes": number;
    "Yes, but Fairhold Land Rent only, because the deposit is lower": number;
    "No, it's still too expensive": number;
    "I don't know": number;
}

export type CountryResults = {
    [key: string]: number;
}

export type TenureChoiceResults = {
    nodes: [
        {name: "Fairhold"},
        {name: "Freehold"},
        {name: "Private rent"},
        {name: "Social rent"},
        {name: "Shared ownership"},
        {name: "Other"},
    ];
    links: { source: number; target: number; value: number }[];
};

export type HouseTypeResults = {
    nodes: [
        {name: "A studio"},
        {name: "A flat"},
        {name: "A house"},
        {name: "I don't mind"},
        {name: "Other"},
    ];
    links: { source: number; target: number; value: number }[];
};

export type HousingOutcomesResults = {
    "Security from being evicted": number;
    "Lower cost": number;
    "Proximity to work": number;
    "Proximity to friends and family": number;
    "Proximity to good schools": number;
    "To get my money back when I sell": number;
    "To retire with low outgoings": number;
    "Lower energy bills": number;
    "Freedom to improve or repair my home myself": number;
    "Home kept in good state of repair by others": number;
    "Quality of space": number;
    "More space": number;
    "Sense of community / shared spaces within the neighbourhood": number;
    "Better public transport connections": number;
    "Walkable neighbourhood": number;
    "Lower crime / antisocial behaviour": number;
    "Being able to easily move home whenever I want to": number;
    "My home to increase in value as an investment": number;
    "Rent as a source of income": number;
    "Freedom from stress or exploitation (for example, debt, maintenance responsibilities, toxic relationships, bad landlords, or exploitative management companies)": number;
    "None of these. My current situation is fine.": number;
    "Other": number;
}

export type LiveWithResults = {
    nodes: [
        {name: "Alone"},
        {name: "With friends"},
        {name: "With partner / family"},
        {name: "With parents or extended family"},
        {name: "Other"},
    ];
    links: { source: number; target: number; value: number }[];
};

export type SupportDevelopmentResults = {
    "Strongly supportive of any development": number;
    "Quite supportive of most development": number;
    "It depends": number;
    "Quite opposed to most development": number;
    "Strongly opposed to any development": number;
    "Don't know": number;
}

export type SupportDevelopmentFactorsResults = {
    "Homes that are affordable to keyworkers": number;
    "Affordable tenure homes for low-income families": number;
    "Priority given to local residents and their families (to allow downsizing, for example)": number;
    "Community-led or self-build development (designed for people, not profit)": number;
    "Council or social housing provider led (designed for people, not profit)": number;
    "Beautiful design that complements and improves the local character": number;
    "Traditional design, with a heritage character": number;
    "Well-supported by new infrastructure (eg. public transport, schools, GPs, parks)": number;
    "Walkable streets with trees and green spaces": number;
    "Includes shops, cafés and community facilities": number;
    "Small-scale development spread across the area": number;
    "Infill development on gap sites, increasing the density of existing neighbourhoods": number;
    "Only build new neighbourhoods on sites away from existing homes": number;  
    "Environmentally sustainable, zero-carbon homes, protecting biodiversity": number;
    "Procured locally, sustaining local jobs": number;
    "Includes a financial return for me and my family": number;
    "Includes a financial return for the local community": number;
    "No new build. We should only create new homes by converting existing buildings or bringing empty homes back into use.": number;
    "None of these, there shouldn't be any new homes": number;
    "Other": number;
}

export type SupportNewFairholdResults = {
    "Strongly support": number;
    "Somewhat support": number;
    "Neither support nor oppose": number;
    "Somewhat oppose": number;
    "Strongly oppose": number;
    "Other": number;
}