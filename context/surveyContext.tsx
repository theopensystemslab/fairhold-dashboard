import { createContext, useContext } from 'react';
import { SurveyResults } from '@lib/survey/types';

export const SurveyContext = createContext<SurveyResults | null>(null);

export function useSurveyContext(): SurveyResults {
    const surveyContext = useContext(SurveyContext);
    if (surveyContext === null) { 
        throw new Error("useSurveyContext must be used within a SurveyContext.Provider");
    }
    return surveyContext;
}