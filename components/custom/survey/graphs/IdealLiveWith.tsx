import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey"
import { useSurveyContext } from "@context/surveyContext";

export const IdealLiveWith = () => {
    const { idealLiveWith } = useSurveyContext().sankey;
    const color = "rgb(var(--fairhold-equity-color-rgb))";
    const coloredNodes = idealLiveWith.nodes.map((node) => ({...node, color}));
    
    return (
        <SurveyGraphCard title="Who do you want to live with?">
            <CustomSankey
                nodes={coloredNodes}
                links={idealLiveWith.links}     
                leftLabel="Current"
                rightLabel="Ideal" 
                >
            </CustomSankey>
        </SurveyGraphCard>
    )
}
