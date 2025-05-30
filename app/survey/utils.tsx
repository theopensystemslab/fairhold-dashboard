import { Results, RawResults } from "./types"

export const aggregateResults = (rawResults: RawResults[]) => {
    const results = initializeResultsObject();
    const numberResponses = rawResults.length;

    for (const rawResult of rawResults) {
        Object.entries(rawResult).forEach(([key, value]) => {
            if (key === "id") return; // Skip the id field (we don't need it)

            const validKey = key as keyof Omit<RawResults, "id">; // Explicitly assert key type

            if (Array.isArray(value)) {
                // We need to handle arrays because some questions are multiple choice
                value.map((item) => addResult(results, validKey, item))
            } else {
                // The rest of the answers are single strings
                addResult(results, validKey, value)
            }
        })
    }
    return { numberResponses, results };
}

const initializeResultsObject = (): Results => {
    return {
        uk: [],
        nonUk: [],
        postcode: [],
        ageGroup: [],
        houseType: [],
        currentTenure: [],
        ownershipModel: [],
        rentalModel: [],
        liveWith: [],
        secondHomes: [],
        idealHouseType: [],
        idealLiveWith: [],
        housingOutcomes: [],
        fairholdCalculator: [],
        affordFairhold: [],
        currentMeansTenureChoice: [],
        whyFairhold: [],
        whyNotFairhold: [],
        anyMeansTenureChoice: [],
        supportDevelopment: [],
        supportDevelopmentFactors: [],
        supportNewFairhold: []
    } as Results;
};

const addResult = (results: Results, validKey: keyof Results, answer: string | string[] | undefined ) => {
    const existingResult = results[validKey].find((result) => result.answer === answer);

    if (existingResult) {
            existingResult.value++;
        } else {
            results[validKey].push({ answer, value: 1 });
        }

}
