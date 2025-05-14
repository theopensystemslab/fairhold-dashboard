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
        Object.entries(rawResult).forEach(([key, value]) => {
            if (key === "id") return; // Skip the id field (we don't need it)

            const validKey = key as keyof RawResults;

            if (key in sankey) {
                addSankeyResult(sankey, rawResult);
            } 
            else if (key in barOrPie) {
                // Answers might be arrays (multiple choice) or single strings, have to handle both
                if (Array.isArray(value)) {
                    value.forEach((item) => addBarOrPieResult(barOrPie, validKey as keyof BarOrPieResults, item));
                } else {
                    addBarOrPieResult(barOrPie, validKey as keyof BarOrPieResults, value);
                }
            }
        });
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

const addBarOrPieResult = (results: BarOrPieResults, validKey: keyof BarOrPieResults, answer: string | string[] | undefined ) => {
    const existingResult = results[validKey].find((result) => result.answer === answer);

    if (existingResult) {
            existingResult.value++;
        } else {
            results[validKey].push({ answer, value: 1 });
        }

}

const addSankeyResult = (results: SankeyResults, rawResult: RawResults) => {
    SANKEY_MAPPINGS.forEach(({ fromKey, toKey, newKey, isArray }) => {
        const fromValue = rawResult[fromKey as keyof RawResults];
        const toValue = rawResult[toKey as keyof RawResults];

        if (!fromValue || Array.isArray(fromValue) || !toValue) return; // Skip if either value is missing

        const sankeyResult = results[newKey as keyof SankeyResults];

        if (isArray && Array.isArray(toValue)) {
            toValue.forEach((toItem) => {
                updateSankeyNodesAndLinks(sankeyResult, fromValue, toItem);
            });
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