import { createContext, useContext } from 'react';
import { SurveyResults } from '@lib/survey/types';

export const SurveyContext = createContext<SurveyContextType | null>(null);
export interface SurveyContextType {
    surveyResults: SurveyResults;
    loading: boolean;
}


export function useSurveyContext(): SurveyContextType {
    const surveyContext = useContext(SurveyContext);
    if (surveyContext === null) { 
        throw new Error("useSurveyContext must be used within a SurveyContext.Provider");
    }
    return surveyContext;
}

export const defaultSurveyResults: SurveyResults = {
    numberResponses: 0,
    barOrPie: {
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
        anyMeansTenureChoice: [],
        supportDevelopment: [],
        supportDevelopmentFactors: [],
        supportNewFairhold: [],
    },
    sankey: {
        idealHouseType: {
            nodes: [],
            links: [],
        },
        idealLiveWith: {
            nodes: [],
            links: [],
        },
        currentMeansTenureChoice: {
            nodes: [],
            links: [],
        },
    },
};