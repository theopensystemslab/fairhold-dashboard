import { Results, RawResults } from "./types"

export const aggregateResults = (rawResults: RawResults[]) => {
    const results: Results = {} as Results;
    const numberResponses = rawResults.length;

    for (const rawResult of rawResults) {
        for (const key in rawResult) {
            if (key === "id") continue; // Skip the id field (we don't need it)
            const validKey = key as keyof RawResults; // Explicitly assert key type
            const value = rawResult[validKey];
            if (!results[validKey]) {
                results[validKey] = [];
            }

            if (Array.isArray(value)) {
                // We need to handle arrays because some questions are multiple choice
                for (const item of value) {
                    const existingResult = results[validKey].find((result) => result.response === item);
                    if (existingResult) {
                        existingResult.count++;
                    } else {
                        results[validKey].push({ response: item, count: 1 });
                    }
                }
            } else {
                // The rest of the answers are single strings
                const existingResult = results[validKey].find((result) => result.response === value);
                if (existingResult) {
                    existingResult.count++;
                } else {
                    results[validKey].push({ response: value, count: 1 });
                }
            }
        }
    }
    return { numberResponses, results };
}