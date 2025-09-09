import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey"
import { useSurveyContext } from "@context/surveyContext";

export const IdealLiveWith = () => {
    const { idealLiveWith } = useSurveyContext().sankey;

    return (
        <SurveyGraphCard title="Who do you want to live with?">
            <CustomSankey
                nodes={idealLiveWith.nodes}
                links={idealLiveWith.links}     
                leftLabel="I live with"
                rightLabel="I want to live with" 
                >
            </CustomSankey>
        </SurveyGraphCard>
    )
}
