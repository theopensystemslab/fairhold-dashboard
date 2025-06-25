import { RawResults, BarOrPieResults, SankeyResults, SankeyResult } from "./types"
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
        housingOutcomes: [],
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
    const getExistingResult = (key: keyof BarOrPieResults, answer: string) => 
        results[key].find(result => result.answer === answer);

    const addResultItem = (key: keyof BarOrPieResults, item: string) => {
        const existingResult = getExistingResult(key, item);
        existingResult
            ? existingResult.value++
            : results[key].push({ answer: item, value: 1 });
    };

    Object.entries(rawResult).forEach(([key, value]) => {
        if (key === "id" || !(key in results)) return;

        const validKey = key as keyof BarOrPieResults;
        
        const isMultipleChoiceAnswer = Array.isArray(value);
        
        isMultipleChoiceAnswer
            ? value.forEach(item => addResultItem(validKey, item))
            : addResultItem(validKey, value);
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