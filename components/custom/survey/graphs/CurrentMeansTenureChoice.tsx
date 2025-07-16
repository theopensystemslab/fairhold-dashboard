import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey"
import { ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@context/surveyContext";
import { applyNodeColors } from "@lib/survey/utils";
export const CurrentMeansTenureChoice = () => {
    const { currentMeansTenureChoice } = useSurveyContext().sankey;
    // We use suffixes to distinguish between current and ideal so we don't end up with circular links (eg for Freehold -> Freehold), so we need to remove the suffixes
    let formattedNodes = currentMeansTenureChoice.nodes.map((node) => ({
        ...node,
        name: node.name.replace(/_(0|1)$/, ""),
    }));
    formattedNodes = applyNodeColors(formattedNodes);

    return (
        <SurveyGraphCard title="Which tenure would you choose?">
            <ResponsiveContainer width="100%" height="100%">
                <CustomSankey
                    nodes={formattedNodes}
                    links={currentMeansTenureChoice.links}     
                    leftLabel="I live in"
                    rightLabel="I want to live in"   
                   >
                </CustomSankey>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
