import { RawResults, BarOrPieResults, BarOrPieResult, SankeyResults, SankeyResult } from "./types"
import {
  AFFORD_FAIRHOLD_ORDER,
  AGE_ORDER,
  SUPPORT_DEVELOPMENT_ORDER,
  SUPPORT_FAIRHOLD_ORDER,
} from "./constants";

const SANKEY_MAPPINGS = [
  { fromKey: 'houseType', toKey: 'idealHouseType', newKey: 'idealHouseType', isArray: false },
  { fromKey: 'liveWith', toKey: 'idealLiveWith', newKey: 'idealLiveWith', isArray: false },
  { fromKey: 'currentTenure', toKey: 'currentMeansTenureChoice', newKey: 'currentMeansTenureChoice', isArray: false },
  { fromKey: 'currentTenure', toKey: 'anyMeansTenureChoice', newKey: 'anyMeansTenureChoice', isArray: true }
];

const CUSTOM_ORDERS: Record<string, string[]> = {
  affordFairhold: AFFORD_FAIRHOLD_ORDER,
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

    Object.entries(barOrPie).forEach(([key, arr]) => {
        if (Array.isArray(arr)) {
            const customOrder = CUSTOM_ORDERS[key];
            if (customOrder) {
                arr.sort(
                  (a, b) =>
                    customOrder.indexOf((a.answer ?? "") as string) -
                    customOrder.indexOf((b.answer ?? "") as string)
                );
            } else {
                arr.sort((a, b) => b.value - a.value);
            }
        }
    });

    Object.values(barOrPie.housingOutcomes).forEach((arr) => {
        arr.sort((a, b) => b.value - a.value);
    });

    return { numberResponses, barOrPie, sankey };
}

const initializeBarOrPieResultsObject = (): BarOrPieResults => {
    return {
        uk: [],
        nonUk: [],
        postcode: [],
        ageGroup: [],
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
        currentMeansTenureChoice: { nodes: [], links: [] },
        anyMeansTenureChoice: { nodes: [], links: [] },
    } as SankeyResults;
};

const addBarOrPieResult = (results: BarOrPieResults, rawResult: RawResults) => {
    Object.entries(rawResult).forEach(([key, value]) => {
        if (key === "id" || !(key in results)) return;

        const validKey = key as keyof BarOrPieResults;

        if (validKey === "housingOutcomes") {
            handleHousingOutcomes(results, value, rawResult.currentTenure);
            return;
        }

        if (Array.isArray(results[validKey])) {
            const arr = results[validKey] as BarOrPieResult[];
            const isMultipleChoiceAnswer = Array.isArray(value);
            isMultipleChoiceAnswer
                ? value.forEach(item => addResultItem(arr, item))
                : addResultItem(arr, value);
        }
    });
};

const addSankeyResult = (results: SankeyResults, rawResult: RawResults) => {
    SANKEY_MAPPINGS.forEach(({ fromKey, toKey, newKey, isArray }) => {
        const fromValue = rawResult[fromKey as keyof RawResults];
        const toValue = rawResult[toKey as keyof RawResults];

        if (!fromValue || Array.isArray(fromValue) || !toValue) return; // Skip if either value is missing

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

export const getTopFive = (data: BarOrPieResult[]) => data.slice(0,5);

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
    value: unknown,
    currentTenure: string
) => {
    const tenure = mapTenureCategory(currentTenure || "Unknown");
    if (!results.housingOutcomes[tenure]) {
        results.housingOutcomes[tenure] = [];
    }
    if (Array.isArray(value)) {
        value.forEach(item =>
            addResultItem(results.housingOutcomes[tenure], item)
        );
    }
};

const getExistingResult = (arr: BarOrPieResult[], answer: string) =>
    arr.find((result) => result.answer === answer);

const addResultItem = (arr: BarOrPieResult[], item: string) => {
    const existingResult = getExistingResult(arr, item);
    existingResult
        ? existingResult.value++
        : arr.push({ answer: item, value: 1 });
};