import { RawResults, BarOrPieResults, SankeyResults } from "./types"

const SANKEY_MAPPINGS = [
  { fromKey: 'houseType', toKey: 'idealHouseType', newKey: 'idealHouseType', isArray: false },
  { fromKey: 'liveWith', toKey: 'idealLiveWith', newKey: 'idealLiveWith', isArray: false },
  { fromKey: 'currentTenure', toKey: 'currentMeansTenureChoice', newKey: 'currentMeansTenureChoice', isArray: false },
  { fromKey: 'currentTenure', toKey: 'anyMeansTenureChoice', newKey: 'anyMeansTenureChoice', isArray: true }
];

export const aggregateResults = (rawResults: RawResults[]) => {
    // There are two different data types we might need, both need to be initialised then handled separately
    const barOrPie = initializeBarOrPieResultsObject();
    const sankey = initializeSankeyResultsObject();
    const numberResponses = rawResults.length;

        for (const rawResult of rawResults) {
            addBarOrPieResult(barOrPie, rawResult);
            addSankeyResult(sankey, rawResult);
    }
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
        houseType: { nodes: [], links: [] },
        liveWith: { nodes: [], links: [] },
        currentMeansTenureChoice: { nodes: [], links: [] },
        anyMeansTenureChoice: { nodes: [], links: [] },
    } as SankeyResults;
};

const addBarOrPieResult = (results: BarOrPieResults, rawResult: RawResults) => {
    Object.entries(rawResult).forEach(([key, value]) => {
        if (key === "id") return;
        if (!(key in results)) return;

        const validKey = key as keyof BarOrPieResults;
        if (Array.isArray(value)) {
            value.forEach((item) => {
                const existingResult = results[validKey].find((result) => result.answer === item);
                if (existingResult) {
                    existingResult.value++;
                } else {
                    results[validKey].push({ answer: item, value: 1 });
                }
            });
        } else {
            const existingResult = results[validKey].find((result) => result.answer === value);
            if (existingResult) {
                existingResult.value++;
            } else {
                results[validKey].push({ answer: value, value: 1 });
            }
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
    sankeyResult: { nodes: { name: string }[]; links: { source: number; target: number; value: number }[] },
    fromValue: string,
    toValue: string
) => {
    const nodes = sankeyResult.nodes;
    const links = sankeyResult.links;

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