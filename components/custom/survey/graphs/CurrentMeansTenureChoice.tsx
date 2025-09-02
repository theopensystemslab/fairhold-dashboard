import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey"
import { ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@context/surveyContext";
import { applyNodeColors } from "@lib/survey/utils";

export const CurrentMeansTenureChoice = () => {
    const { currentMeansTenureChoice } = useSurveyContext().sankey;
    const colouredNodes = applyNodeColors(currentMeansTenureChoice.nodes);

    return (
        <SurveyGraphCard title="Which tenure would you choose?">
            <ResponsiveContainer width="100%" height="100%">
                <CustomSankey
                    nodes={colouredNodes}
                    links={currentMeansTenureChoice.links}     
                    leftLabel="I live in"
                    rightLabel="I want to live in"   
                   >
                </CustomSankey>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
