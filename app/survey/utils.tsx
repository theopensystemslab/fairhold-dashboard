import { Results, RawResults } from "./types"

export const aggregateResults = (rawResults: RawResults[]) => {
    const results: Results = {} as Results;
    const numberResponses = rawResults.length;

    for (const rawResult of rawResults) {
        Object.entries(rawResult).forEach(([key, value]) => {
            if (key === "id") return; // Skip the id field (we don't need it)

            const validKey = key as keyof RawResults; // Explicitly assert key type
            if (!results[validKey]) {
                results[validKey] = [];
            }

            if (Array.isArray(value)) {
                // We need to handle arrays because some questions are multiple choice
                for (const item of value) {
                    const existingResult = results[validKey].find((result) => result.answer === item);
                    if (existingResult) {
                        existingResult.value++;
                    } else {
                        results[validKey].push({ answer: item, value: 1 });
                    }
                }
            } else {
                // The rest of the answers are single strings
                const existingResult = results[validKey].find((result) => result.answer === value);
                if (existingResult) {
                    existingResult.value++;
                } else {
                    results[validKey].push({ answer: value, value: 1 });
                }
            }
        })
    }
    return { numberResponses, results };
}