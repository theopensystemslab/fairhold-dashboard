import { Results, RawResults } from "./types"

export const aggregateResults = (rawResults: RawResults[]) => {
    const results: Results = {} as Results;

    for (const rawResult of rawResults) {
        for (const key in rawResult) {
            if (key === "id") continue; // Skip the id field (we don't need it)
            const validKey = key as keyof RawResults; // Explicitly assert key type
            const value = rawResult[validKey];
            if (!results[validKey]) {
                results[validKey] = [];
            }
            const existingResult = results[validKey].find((result) => result.response === value);
            if (existingResult) {
                existingResult.count++;
            } else {
                results[validKey].push({ response: value, count: 1 });
            }
        }
    }
    console.log({results})
    return results;
}