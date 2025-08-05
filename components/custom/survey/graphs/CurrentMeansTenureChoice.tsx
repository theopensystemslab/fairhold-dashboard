import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey"
import { ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@context/surveyContext";
import { applyNodeColors } from "@lib/survey/utils";

const getLabel = (name: string) => {
    switch (name) {
        case "Part own, part rent":
            return "Shared ownership";
        case "I live for free in a home":
            return "Free housing";
        case "I do not have a stable home at the moment":
            return "No stable home";
        default:
            return name;
    }
};

export const CurrentMeansTenureChoice = () => {
    const { currentMeansTenureChoice } = useSurveyContext().sankey;
    
    // We use suffixes to distinguish between current and ideal so we don't end up with circular links (eg for Freehold -> Freehold), so we need to remove the suffixes
    const formattedNodes = currentMeansTenureChoice.nodes.map((node) => ({
        ...node,
        name: node.name.replace(/_(0|1)$/, ""),
    }));
    const labeledNodes = formattedNodes.map((node: { name: string }) => ({
        ...node,
        label: getLabel(node.name),
    }));
    const colouredNodes = applyNodeColors(labeledNodes);

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
