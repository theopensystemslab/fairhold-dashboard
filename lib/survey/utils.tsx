import { RawResults, BarOrPieResults, BarOrPieResult, SankeyResults, SankeyResult } from "./types"
import {
  AFFORD_FAIRHOLD,
  AGE_ORDER,
  SUPPORT_DEVELOPMENT_ORDER,
  SUPPORT_FAIRHOLD_ORDER,
  HOUSING_OUTCOMES_LABELS,
  WHY_FAIRHOLD_LABELS,
  WHY_NOT_FAIRHOLD_LABELS,
  SUPPORT_DEVELOPMENT_LABELS
} from "./constants";

const SANKEY_MAPPINGS = [
  { fromKey: 'houseType', toKey: 'idealHouseType', newKey: 'idealHouseType', isArray: false },
  { fromKey: 'liveWith', toKey: 'idealLiveWith', newKey: 'idealLiveWith', isArray: false },
  { fromKey: 'currentTenure', toKey: 'currentMeansTenureChoice', newKey: 'currentMeansTenureChoice', isArray: false },
];

const CUSTOM_ORDERS: Record<string, string[]> = {
  affordFairhold: AFFORD_FAIRHOLD.map(item => item.label),
  ageGroup: AGE_ORDER,
  supportDevelopment: SUPPORT_DEVELOPMENT_ORDER,
  supportNewFairhold: SUPPORT_FAIRHOLD_ORDER,
};

export const aggregateResults = (rawResults: RawResults[]) => {
    // There are two different data types we might need, both need to be initialised then handled separately
    const barOrPie = initializeBarOrPieResultsObject();
    const sankey = initializeSankeyResultsObject();
    const numberResponses = rawResults.length;

    for (const rawResult of rawResults) {
        addBarOrPieResult(barOrPie, rawResult);
        addSankeyResult(sankey, rawResult);
    }
    // const shortenedBarOrPie = shortenStrings(barOrPie);
    const sortedBarOrPie = sortResults(barOrPie);
    const slicedBarOrPie = getTopFive(sortedBarOrPie);
    const shortenedBarOrPie = shortenStrings(slicedBarOrPie);
    
    return { numberResponses, barOrPie: shortenedBarOrPie, sankey };
}

const initializeBarOrPieResultsObject = (): BarOrPieResults => {
    return {
        uk: [],
        nonUk: [],
        postcode: [],
        ageGroup: [],
        anyMeansTenureChoice: [],
        ownershipModel: [],
        rentalModel: [],
        secondHomes: [],
        housingOutcomes: {},
        fairholdCalculator: [],
        affordFairhold: [],
        whyFairhold: [],
        whyNotFairhold: [],
        supportDevelopment: [],
        supportDevelopmentFactors: [],
        supportNewFairhold: []
    } as BarOrPieResults;
};

const initializeSankeyResultsObject = (): SankeyResults => {
    return {
        idealHouseType: { nodes: [], links: [] },
        idealLiveWith: { nodes: [], links: [] },
        currentMeansTenureChoice: { nodes: [], links: [] }
    } as SankeyResults;
};

const addBarOrPieResult = (results: BarOrPieResults, rawResult: RawResults) => {

    Object.entries(rawResult).forEach(([key, value]) => {
        if (key === "id" || !(key in results)) return;

        const validKey = key as keyof BarOrPieResults;

        // We handle anyMeansTenureChoice differently because it's ranked choice, and each rank has a points-based weight
        if (validKey === "anyMeansTenureChoice") { 
            handleAnyMeansTenureChoice(results, value as string[]);
            return;
        }

        if (validKey === "housingOutcomes") {
            handleHousingOutcomes(results, value as string[], rawResult.currentTenure);
            return;
        }

        const arr = results[validKey] as BarOrPieResult[];
        const isMultipleChoiceAnswer = Array.isArray(value);
        isMultipleChoiceAnswer
            ? value.forEach(item => addResultItem(arr, item))
            : addResultItem(arr, value);
    });
};

const addSankeyResult = (results: SankeyResults, rawResult: RawResults) => {
    SANKEY_MAPPINGS.forEach(({ fromKey, toKey, newKey, isArray }) => {
        const fromValue = rawResult[fromKey as keyof RawResults] as string;
        const toValue = rawResult[toKey as keyof RawResults] as string;

        const sankeyResult = results[newKey as keyof SankeyResults];

        if (isArray && Array.isArray(toValue) && toValue.length > 0) {
            updateSankeyNodesAndLinks(sankeyResult, fromValue, toValue[0]);
        } else {
            updateSankeyNodesAndLinks(sankeyResult, fromValue, toValue as string);
        }
    });
};

const updateSankeyNodesAndLinks = (
    sankeyResult: SankeyResult,
    fromValue: string,
    toValue: string
) => {
    const { nodes, links } = sankeyResult;

    // Find or add the source node
    let sourceIndex = nodes.findIndex((node) => node.name === fromValue);
    if (sourceIndex === -1) {
        sourceIndex = nodes.length;
        nodes.push({ name: fromValue });
    }

    // Find or add the target node
    let targetIndex = nodes.findIndex((node) => node.name === toValue);
    if (targetIndex === -1) {
        targetIndex = nodes.length;
        nodes.push({ name: toValue });
    }

    // Find or add the link
    const existingLink = links.find(
        (link) => link.source === sourceIndex && link.target === targetIndex
    );
    if (existingLink) {
        existingLink.value++;
    } else {
        links.push({ source: sourceIndex, target: targetIndex, value: 1 });
    }
};

const getTopFive = (barOrPieResults: BarOrPieResults) => {
    for (const key in barOrPieResults) {
        if (key === "whyFairhold" || key === "whyNotFairhold") {
            barOrPieResults[key] = barOrPieResults[key].slice(0,5);
        }
    }
    return barOrPieResults;
}

export const calculateChartMaximum = (data: BarOrPieResult[]) => {
    const maxValue = data[0]?.value ?? 0;
    const maxResponses = Math.ceil(maxValue / 10) * 10;
    const chartMax = maxResponses < 10 ? 10 : maxResponses;
    return chartMax;
}

const mapTenureCategory = (tenure: string): string => {
    tenure = tenure.trim();

    switch (tenure) {
    case "I own it outright":
        return "Market purchase";
    case "I own it with a mortgage":
        return "Market purchase";
    case "I rent it":
        return "Private rent";
    case "Part own, part rent":
        return "Shared ownership";
    }
    return "Other";
};

const handleHousingOutcomes = (
    results: BarOrPieResults,
    value: string[],
    currentTenure: string
) => {
    const tenure = mapTenureCategory(currentTenure);
    if (!results.housingOutcomes[tenure]) {
        results.housingOutcomes[tenure] = [];
    }
    value.forEach(item =>
        addResultItem(results.housingOutcomes[tenure], item)
    );
}

const getExistingResult = (arr: BarOrPieResult[], answer: string) =>
    arr.find((result) => result.answer === answer);

const addResultItem = (arr: BarOrPieResult[], item: string, weight: number = 1) => {
    const existingResult = getExistingResult(arr, item);
    existingResult
        ? existingResult.value += weight
        : arr.push({ answer: item, value: 1 });
};

const handleAnyMeansTenureChoice = (results: BarOrPieResults, value: string[]) => {
    value.forEach((item, idx) => {
        // Tidying the string
        let shortAnswer = item.split("––")[0].trim();
        shortAnswer = shortAnswer.replace("Freehold", "Market purchase");
        // For now: 5 weight for position 1, 4 for position 2, etc.
        const weight = Math.max(5 - idx, 1);
        addResultItem(results.anyMeansTenureChoice, shortAnswer, weight);
    });
};

const sortResults = (results: BarOrPieResults) => {
    Object.entries(results).forEach(([key, arr]) => {
        // Only sort if key is one of the four with a custom order
        if (["affordFairhold", "ageGroup", "supportDevelopment", "supportNewFairhold"].includes(key)) {
            const customOrder = CUSTOM_ORDERS[key];
            if (customOrder) {
                (arr as BarOrPieResult[]).sort(
                    (a, b) =>
                        customOrder.indexOf((a.answer ?? "") as string) -
                        customOrder.indexOf((b.answer ?? "") as string)
                );
            }
        }
        if (["anyMeansTenureChoice", "whyFairhold", "whyNotFairhold", "supportDevelopmentFactors"].includes(key)) {
            (arr as BarOrPieResult[]).sort((a, b) => b.value - a.value);
        }
    });
    // Descending sort for housing outcomes is separate because it's grouped by tenure and thus a nested object
    Object.values(results.housingOutcomes).forEach((arr) => {
        arr.sort((a, b) => b.value - a.value);
    });

    return results;
}

const shortenStrings = (results: BarOrPieResults) => {
    Object.entries(results).forEach(([key, arr]) => {
        if (key === "whyFairhold") {
            (arr as BarOrPieResult[]).forEach(item => {
                const label = WHY_FAIRHOLD_LABELS[item.answer as keyof typeof WHY_FAIRHOLD_LABELS];
                if (label) {
                    item.answer = label;
                } else {
                    item.answer = "Other;"
                }
            });
        }
        else if (key === "whyNotFairhold") {
            (arr as BarOrPieResult[]).forEach(item => {
                const label = WHY_NOT_FAIRHOLD_LABELS[item.answer as keyof typeof WHY_NOT_FAIRHOLD_LABELS];
                if (label) {
                    item.answer = label;
                } else {
                    item.answer = "Other";
                }
            });
        }
        else if (key === "supportDevelopmentFactors") {
            (arr as BarOrPieResult[]).forEach(item => {
                const label = SUPPORT_DEVELOPMENT_LABELS[item.answer as keyof typeof SUPPORT_DEVELOPMENT_LABELS];
                if (label) {
                    item.answer = label;
                } else {
                    item.answer = "Other";
                }
            })
        }
        else if (key === "housingOutcomes") {
    const outcomesRecord = arr as Record<string, BarOrPieResult[]>;
    Object.values(outcomesRecord).forEach((outcomeArr) => {
        outcomeArr.forEach((item) => {
            const label = HOUSING_OUTCOMES_LABELS[item.answer as keyof typeof HOUSING_OUTCOMES_LABELS];
            if (label) {
                item.answer = label;
            }
        });
    });
}
    })
    return results;
}