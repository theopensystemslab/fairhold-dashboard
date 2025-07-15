import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey"
import { ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@context/surveyContext";

export const IdealLiveWith = () => {
    const idealLiveWith = useSurveyContext().sankey.idealLiveWith;
    const color = "rgb(var(--fairhold-equity-color-rgb))";
    const coloredNodes = idealLiveWith.nodes.map((node) => ({...node, color}));
    
    return (
        <SurveyGraphCard title="Who do you want to live with?">
            <ResponsiveContainer width="100%" height="100%">
                <CustomSankey
                    nodes={coloredNodes}
                    links={idealLiveWith.links}     
                    leftLabel="Current"
                    rightLabel="Ideal" 
                   >
                </CustomSankey>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
