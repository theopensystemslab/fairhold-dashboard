import { AgeResults, 
    AffordFairholdResults, 
    CountryResults,
    HouseTypeResults,
    HousingOutcomesResults,
    LiveWithResults,
    SurveyResults, 
    TenureChoiceResults,
    SupportDevelopmentResults,
    SupportDevelopmentFactorsResults,
    SupportNewFairholdResults,
    FormattedSurveyResults, 
} from "./types";

export const formatSurveyResults = (results: SurveyResults[]): FormattedSurveyResults => {
    const formattedResults: FormattedSurveyResults = {
        affordFairhold: formatAffordFairhold(results),
        age: formatAgeData(results),
        anyMeansTenureChoice: formatAnyMeansTenureChoice(results),
        country: formatCountryResults(results),
        currentMeansTenureChoice: formatCurrentMeansTenureChoice(results),
        houseType: formatHouseTypeResults(results),
        housingOutcomes: formatHousingOutcomesResults(results), 
        liveWith: formatLiveWithResults(results), 
        supportDevelopment: formatSupportDevelopmentResults(results),
        supportDevelopmentFactors: formatSupportDevelopmentFactorsResults(results), 
        supportNewFairhold: formatSupportNewFairholdResults(results),
    };
    return formattedResults;
}
const formatAffordFairhold = (results: SurveyResults[]): AffordFairholdResults => {
    return createPieOrBarChartData(results, "affordFairhold", [
        "Yes",
        "Yes, but Fairhold Land Rent only, because the deposit is lower",
        "No, it's still too expensive",
        "I don't know",
    ])
};

const formatAgeData = (results: SurveyResults[]): AgeResults => {
    return createPieOrBarChartData(results, "ageGroup", [
        "0-18",
        "19-24",
        "25-34",
        "35-44",
        "45-54",
        "55-64",
        "65+",
    ])
}

const formatAnyMeansTenureChoice = (results: SurveyResults[]): TenureChoiceResults => { 
    // The answers to the two relevant questions are different (first is a select, second is ranked), so must be mapped
    const mappedResults = results.map((result) => {
        const targetArray = result.anyMeansTenureChoice as string[]; // Assuming this is an array of ranked choices
        const mappedChoices = targetArray.map((choice) => {
            if (choice.includes("Fairhold")) return "Fairhold";
            if (choice.includes("Freehold")) return "Freehold";
            if (choice.includes("Private rent")) return "Private rent";
            if (choice.includes("Social rent")) return "Social rent";
            if (choice.includes("Shared ownership")) return "Shared ownership";
            return "Other"; // Default to "Other" if no match
        });
        return { ...result, anyMeansTenureChoice: mappedChoices };
    });
    
    return createSankeyData(
        mappedResults,
        "currentTenure",
        "anyMeansTenureChoice",
        [
            { name: "Fairhold" },
            { name: "Freehold" },
            { name: "Private rent" },
            { name: "Social rent" },
            { name: "Shared ownership" },
            { name: "Other" },
        ]
    ) as TenureChoiceResults;
};

const formatCountryResults = (results: SurveyResults[]): CountryResults => {
    const countryData: CountryResults = {};
    results.forEach((result) => { 
        const country = result.uk === "United Kingdom" ? result.uk : result.nonUk;
        if (countryData[country]) {
            countryData[country]++;
        } else {
            countryData[country] = 1;
        }
    })
    return countryData;
}

const formatCurrentMeansTenureChoice = (results: SurveyResults[]): TenureChoiceResults => {
    return createSankeyData(
        results,
        "currentTenure",
        "currentMeansTenureChoice",
        [
            { name: "Fairhold" },
            { name: "Freehold" },
            { name: "Private rent" },
            { name: "Social rent" },
            { name: "Shared ownership" },
            { name: "Other" },
        ]
    ) as TenureChoiceResults;
};

const formatHouseTypeResults = (results: SurveyResults[]): HouseTypeResults => {
// Map single string answers to predefined node names
const mappedResults = results.map((result) => {
    const houseType = result.idealHouseType;
    let mappedChoice: string;

    if (houseType.includes("studio")) {
        mappedChoice = "Studio";
    } else if (houseType.includes("flat")) {
        mappedChoice = "Flat";
    } else if (houseType.includes("house")) {
        mappedChoice = "House";
    } else if (houseType.includes("I don't mind")) {
        mappedChoice = "I don't mind";
    } else {
        mappedChoice = "Other";
    }

    return { ...result, idealHouseType: mappedChoice };
});
    
    return createSankeyData(
        mappedResults,
        "houseType",
        "idealHouseType",
        [
            { name: "A studio" },
            { name: "A flat" },
            { name: "A house" },
            { name: "I don't mind" },
            { name: "Other" },
        ]
    ) as HouseTypeResults;
};

const formatHousingOutcomesResults = (results: SurveyResults[]): HousingOutcomesResults => {
    return createPieOrBarChartData(results, "housingOutcomes", [
        "Security from being evicted",
        "Lower cost",
        "Proximity to work",
        "Proximity to friends and family",
        "Proximity to good schools",
        "To get my money back when I sell",
        "To retire with low outgoings",
        "Lower energy bills",
        "Freedom to improve or repair my home myself",
        "Home kept in good state of repair by others",
        "Quality of space",
        "More space",
        "Sense of community / shared spaces within the neighbourhood",
        "Better public transport connections",
        "Walkable neighbourhood",
        "Lower crime / antisocial behaviour",
        "Being able to easily move home whenever I want to",
        "My home to increase in value as an investment",
        "Rent as a source of income",
        "Freedom from stress or exploitation (for example, debt, maintenance responsibilities, toxic relationships, bad landlords, or exploitative management companies)",
        "None of these. My current situation is fine.",
        "Other",
    ])
}

const formatLiveWithResults = (results: SurveyResults[]): LiveWithResults => {
    // Map single string answers to predefined node names
    const mappedResults = results.map((result) => {
        const liveWith = result.liveWith; // Assuming this is a single string
        let mappedChoice: string;

        if (liveWith.includes("alone")) {
            mappedChoice = "Alone";
        } else if (liveWith.includes("housemates")) {
            mappedChoice = "With friends";
        } else if (liveWith.includes("partner")) {
            mappedChoice = "With partner / family";
        } else if (liveWith.includes("parents")) {
            mappedChoice = "With parents or extended family";
        } else {
            mappedChoice = "Other"; // Default to "Other" if no match
        }

        return { ...result, idealHouseType: mappedChoice };
    });
    
    return createSankeyData(
        mappedResults,
        "liveWith",
        "idealLiveWith",
        [
            { name: "Alone" },
            { name: "With friends" },
            { name: "With partner / family" },
            { name: "With parents or extended family" },
            { name: "Other" },
        ]
    ) as LiveWithResults;
};

const formatSupportDevelopmentResults = (results: SurveyResults[]): SupportDevelopmentResults => {
    return createPieOrBarChartData(results, "supportDevelopment", [
        "Strongly supportive of any development",
        "Quite supportive of most development",
        "It depends",
        "Quite opposed to most development",
        "Strongly opposed to any development",
        "Don't know",
    ])
}

const formatSupportDevelopmentFactorsResults = (results: SurveyResults[]): SupportDevelopmentFactorsResults => {
    return createPieOrBarChartData(results, "supportDevelopmentFactors", [
        "Homes that are affordable to keyworkers",  
        "Affordable tenure homes for low-income families",
        "Priority given to local residents and their families (to allow downsizing, for example)",
        "Community-led or self-build development (designed for people, not profit)",
        "Council or social housing provider led (designed for people, not profit)",
        "Beautiful design that complements and improves the local character",
        "Traditional design, with a heritage character",
        "Well-supported by new infrastructure (eg. public transport, schools, GPs, parks)",
        "Walkable streets with trees and green spaces",
        "Includes shops, cafés and community facilities",
        "Small-scale development spread across the area",
        "Infill development on gap sites, increasing the density of existing neighbourhoods",
        "Only build new neighbourhoods on sites away from existing homes",
        "Environmentally sustainable, zero-carbon homes, protecting biodiversity",
        "Procured locally, sustaining local jobs",
        "Includes a financial return for me and my family",
        "Includes a financial return for the local community",
        "No new build. We should only create new homes by converting existing buildings or bringing empty homes back into use.",
        "None of these, there shouldn't be any new homes",
        "Other"
    ])
}
    

const formatSupportNewFairholdResults = (results: SurveyResults[]): SupportNewFairholdResults => {
    return createPieOrBarChartData(results, "supportNewFairhold", [
        "Strongly support",
        "Somewhat support",
        "Neither support nor oppose",
        "Somewhat oppose",
        "Strongly oppose",
        "Other",
    ])
}

const createPieOrBarChartData = <T extends string>(
    results: SurveyResults[],
    key: keyof SurveyResults,
    predefinedKeys: T[]
): Record<T, number> => {
    const data: Record<T, number> = Object.fromEntries(predefinedKeys.map((k) => [k, 0])) as Record<T, number>;

    for (const result of results) {
        const value = result[key] as T;
        if (value in data) {
            data[value]++;
        }
    }

    return data;
};

const createSankeyData = <T extends { name: string }>(
    results: SurveyResults[],
    sourceKey: keyof SurveyResults,
    targetKey: keyof SurveyResults,
    predefinedNodes: T[]
): { nodes: T[]; links: { source: number; target: number; value: number }[] } => {
    const sankeyData: {
        nodes: T[];
        links: { source: number; target: number; value: number }[];
    } = {
        nodes: predefinedNodes,
        links: [], 
    };

    const nodeIndexMap: { [key: string]: number } = predefinedNodes.reduce(
        (map, node, index) => {
            map[node.name] = index;
            return map;
        },
        {} as { [key: string]: number }
    );

    results.forEach((result) => {
        const source = result[sourceKey] as string;
        const target = result[targetKey] as string;

        const sourceIndex = nodeIndexMap[source];
        const targetIndex = nodeIndexMap[target];

        if (sourceIndex !== undefined && targetIndex !== undefined) {
            const existingLink = sankeyData.links.find(
                (link) => link.source === sourceIndex && link.target === targetIndex
            );

            if (existingLink) {
                existingLink.value++;
            } else {
                sankeyData.links.push({ source: sourceIndex, target: targetIndex, value: 1 });
            }
        }
    });

    return sankeyData;
};