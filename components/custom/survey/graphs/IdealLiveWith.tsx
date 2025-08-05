import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey"
import { useSurveyContext } from "@context/surveyContext";

const getLabel = (name: string) => {
    switch (name) {
        case "I live with my parents":
            return "Parents / extended family";
        case "I live alone":
            return "Alone";
        case "I live with my parents or extended family": // intentional fallthrough
        case "With my parents or extended family":
            return "Parents / extended family";
        case "I live with housemates":
        case "With friends":
            return "Friends / housemates";
        case "I live with my partner / family":
        case "With partner / family": // intentional fallthrough
            return "Partner / family";
        default:
            return name;
    }
};

export const IdealLiveWith = () => {
    const { idealLiveWith } = useSurveyContext().sankey;
    const color = "rgb(var(--fairhold-equity-color-rgb))";
    const coloredNodes = idealLiveWith.nodes.map((node) => ({...node, color}));
    const labeledNodes = coloredNodes.map((node: { name: string }) => ({
    ...node,
    label: getLabel(node.name),
    }));

    return (
        <SurveyGraphCard title="Who do you want to live with?">
            <CustomSankey
                nodes={labeledNodes}
                links={idealLiveWith.links}     
                leftLabel="I live with"
                rightLabel="I want to live with" 
                >
            </CustomSankey>
        </SurveyGraphCard>
    )
}
