import { Results, RawResults } from "./types"

export const aggregateResults = (rawResults: RawResults[]) => {
    const results: Results = {} as Results;
    const numberResponses = rawResults.length;

    for (const rawResult of rawResults) {
        for (const key in rawResult) {
            if (key === "id") continue; // Skip the id field (we don't need it)
            const validKey = key as keyof RawResults; // Explicitly assert key type
            const name = rawResult[validKey];
            if (!results[validKey]) {
                results[validKey] = [];
            }

            if (Array.isArray(name)) {
                // We need to handle arrays because some questions are multiple choice
                for (const item of name) {
                    const existingResult = results[validKey].find((result) => result.name === item);
                    if (existingResult) {
                        existingResult.value++;
                    } else {
                        results[validKey].push({ name: item, value: 1 });
                    }
                }
            } else {
                // The rest of the answers are single strings
                const existingResult = results[validKey].find((result) => result.name === name);
                if (existingResult) {
                    existingResult.value++;
                } else {
                    results[validKey].push({ name: name, value: 1 });
                }
            }
        }
    }
    return { numberResponses, results };
}