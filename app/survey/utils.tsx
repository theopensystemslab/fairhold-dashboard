import { AgeResults, 
    AffordFairholdResults, 
    CountryResults,
    HousingOutcomesResults,
    SankeyResults,
    SurveyResults, 
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
        resultsCount: results.length,
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
    ]) as AffordFairholdResults;
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
    ]) as AgeResults;
}

const formatAnyMeansTenureChoice = (results: SurveyResults[]): SankeyResults => { 
    // The answers to the two relevant questions are different (first is a select, second is ranked), so must be mapped
    const mappedResults = results.map((result) => {
        const targetArray = result.anyMeansTenureChoice as string[]; 
        const firstChoice = targetArray[0]; // Since it's a ranked choice answer, we only want the first choice for the Sankey
        
        // Add prefix to current tenure
        const currentTenureWithPrefix = "Current: " + result.currentTenure;
        
        // Map and add prefix to ideal tenure
        let mappedChoice = "Other";
        if (firstChoice) {
            if (firstChoice.includes("Fairhold")) {
                mappedChoice = "Ideal: Fairhold";
            } else if (firstChoice.includes("Freehold")) {
                mappedChoice = "Ideal: Freehold";
            } else if (firstChoice.includes("Private rent")) {
                mappedChoice = "Ideal: Private rent";
            } else if (firstChoice.includes("Social rent")) {
                mappedChoice = "Ideal: Social rent";
            } else if (firstChoice.includes("Shared ownership")) {
                mappedChoice = "Ideal: Shared ownership";
            } else {
                mappedChoice = "Ideal: Other";
            }
        } else {
            mappedChoice = "Ideal: Other";
        }

        return { 
            ...result, 
            currentTenure: currentTenureWithPrefix,
            anyMeansTenureChoice: [mappedChoice] 
        }; 
    });
    
    return createSankeyData(
        mappedResults,
        "currentTenure",
        "anyMeansTenureChoice",
    ) as SankeyResults;
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

const formatCurrentMeansTenureChoice = (results: SurveyResults[]): SankeyResults => {
    const mappedResults = results.map((result) => {
        // Add prefix to current tenure
        const currentTenureWithPrefix = "Current: " + result.currentTenure;
        
        // Add prefix to potential tenure with current means
        const currentMeansTenureWithPrefix = "Potential: " + result.currentMeansTenureChoice;
        
        return {
            ...result,
            currentTenure: currentTenureWithPrefix,
            currentMeansTenureChoice: currentMeansTenureWithPrefix
        };
    });
    
    return createSankeyData(
        mappedResults,
        "currentTenure",
        "currentMeansTenureChoice"
    ) as SankeyResults;
};

const formatHouseTypeResults = (results: SurveyResults[]): SankeyResults => {
// Map single string answers to predefined node names with prefixes
const mappedResults = results.map((result) => {
    const currentHouseType = result.houseType;
    const idealHouseType = result.idealHouseType;
    
    // Add mappings for current house type
    let mappedCurrentChoice: string;
    if (currentHouseType.includes("studio")) {
        mappedCurrentChoice = "Current: Studio";
    } else if (currentHouseType.includes("flat")) {
        mappedCurrentChoice = "Current: Flat";
    } else if (currentHouseType.includes("house")) {
        mappedCurrentChoice = "Current: House";
    } else {
        mappedCurrentChoice = "Current: Other";
    }
    
    // Add mappings for ideal house type
    let mappedIdealChoice: string;
    if (idealHouseType.includes("studio")) {
        mappedIdealChoice = "Ideal: Studio";
    } else if (idealHouseType.includes("flat")) {
        mappedIdealChoice = "Ideal: Flat";
    } else if (idealHouseType.includes("house")) {
        mappedIdealChoice = "Ideal: House";
    } else if (idealHouseType.includes("I don't mind")) {
        mappedIdealChoice = "Ideal: I don't mind";
    } else {
        mappedIdealChoice = "Ideal: Other";
    }

    return { 
        ...result, 
        houseType: mappedCurrentChoice,
        idealHouseType: mappedIdealChoice 
    };
});
    
    return createSankeyData(
        mappedResults,
        "houseType",
        "idealHouseType"
    ) as SankeyResults;
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
    ]) as HousingOutcomesResults
}

const formatLiveWithResults = (results: SurveyResults[]): SankeyResults => {
    // Map single string answers to predefined node names with prefixes
    const mappedResults = results.map((result) => {
        const currentLiveWith = result.liveWith;
        const idealLiveWith = result.idealLiveWith;
        
        // Add mappings for current living arrangement
        let mappedCurrentChoice: string;
        if (currentLiveWith.includes("alone")) {
            mappedCurrentChoice = "Current: Alone";
        } else if (currentLiveWith.includes("housemates")) {
            mappedCurrentChoice = "Current: With friends";
        } else if (currentLiveWith.includes("partner")) {
            mappedCurrentChoice = "Current: With partner/family";
        } else if (currentLiveWith.includes("parents")) {
            mappedCurrentChoice = "Current: With parents";
        } else {
            mappedCurrentChoice = "Current: Other";
        }
        
        // Add mappings for ideal living arrangement
        let mappedIdealChoice: string;
        if (idealLiveWith.includes("alone")) {
            mappedIdealChoice = "Ideal: Alone";
        } else if (idealLiveWith.includes("housemates")) {
            mappedIdealChoice = "Ideal: With friends";
        } else if (idealLiveWith.includes("partner")) {
            mappedIdealChoice = "Ideal: With partner/family";
        } else if (idealLiveWith.includes("parents")) {
            mappedIdealChoice = "Ideal: With parents";
        } else {
            mappedIdealChoice = "Ideal: Other";
        }

        return { 
            ...result, 
            liveWith: mappedCurrentChoice,
            idealLiveWith: mappedIdealChoice 
        };
    });
    
    return createSankeyData(
        mappedResults,
        "liveWith",
        "idealLiveWith",
    ) as SankeyResults;
};

const formatSupportDevelopmentResults = (results: SurveyResults[]): SupportDevelopmentResults => {
    return createPieOrBarChartData(results, "supportDevelopment", [
        "Strongly supportive of any development",
        "Quite supportive of most development",
        "It depends",
        "Quite opposed to most development",
        "Strongly opposed to any development",
        "Don't know",
    ]) as SupportDevelopmentResults
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
    ]) as SupportDevelopmentFactorsResults
}
    

const formatSupportNewFairholdResults = (results: SurveyResults[]): SupportNewFairholdResults => {
    return createPieOrBarChartData(results, "supportNewFairhold", [
        "Strongly support",
        "Somewhat support",
        "Neither support nor oppose",
        "Somewhat oppose",
        "Strongly oppose",
        "Other",
    ]) as SupportNewFairholdResults
}

const createPieOrBarChartData = <T extends string>(
    results: SurveyResults[],
    key: keyof SurveyResults,
    predefinedKeys: T[]
): { name: T; value: number }[] => {
    const data: Record<T, number> = Object.fromEntries(predefinedKeys.map((k) => [k, 0])) as Record<T, number>;

    for (const result of results) {
        const value = result[key];

        if (value === undefined || value === null) continue; // Skip the record if it's missing 
        
        // Some of the results properties might just be strings, and some of them might be arrays of strings--we need to be able to count both
        if (Array.isArray(value)) {
            for (const item of value) {
                if (item in data) {
                    data[item as T]++;
                }
            }
        } else if (value in data) {
            data[value as T]++;
        }
    }
    
    const formattedPieOrBarChartData = predefinedKeys.map((key) => ({
        name: key,
        value: data[key],
    }));
    return formattedPieOrBarChartData;
};

const createSankeyData = (
    results: SurveyResults[],
    sourceKey: keyof SurveyResults,
    targetKey: keyof SurveyResults
): SankeyResults => {
    const nodesMap: { [key: string]: number } = {};
    const links: { source: number; target: number; value: number }[] = [];

    // Dynamically create nodes and map them to indices
    results.forEach((result) => {
        const source = result[sourceKey] as string;
        const target = result[targetKey] as string;

        if (!(source in nodesMap)) {
            nodesMap[source] = Object.keys(nodesMap).length;
        }
        if (!(target in nodesMap)) {
            nodesMap[target] = Object.keys(nodesMap).length;
        }

        const sourceIndex = nodesMap[source];
        const targetIndex = nodesMap[target];

        // Find or create a link between the source and target
        const existingLink = links.find(
            (link) => link.source === sourceIndex && link.target === targetIndex
        );

        if (existingLink) {
            existingLink.value++;
        } else {
            links.push({ source: sourceIndex, target: targetIndex, value: 1 });
        }
    });

    // Convert nodesMap to an array of nodes
    const nodes = Object.keys(nodesMap).map((name) => ({ name }));

    return { nodes, links };
};