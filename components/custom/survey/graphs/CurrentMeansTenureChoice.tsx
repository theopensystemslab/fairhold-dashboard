import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey"
import { ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@context/surveyContext";
import { applyNodeColors } from "@lib/survey/utils";
export const CurrentMeansTenureChoice = () => {
    const currentMeansTenureChoice = useSurveyContext().sankey.currentMeansTenureChoice;
    
    const coloredNodes = applyNodeColors(currentMeansTenureChoice.nodes);
    return (
        <SurveyGraphCard title="Which tenure would you choose?">
            <ResponsiveContainer width="100%" height="100%">
                <CustomSankey
                    nodes={coloredNodes}
                    links={currentMeansTenureChoice.links}     
                    leftLabel="Current situation"
                    rightLabel="Ideal, with current means"   
                   >
                </CustomSankey>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
