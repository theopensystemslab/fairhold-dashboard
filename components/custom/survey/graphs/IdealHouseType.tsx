import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey";
import { useSurveyContext } from "@context/surveyContext";

const getLabel = (name: string) => {
    switch (name) {
        case "A flat":
            return "Flat";
        case "A house":
            return "House";
        case "A studio":
            return "Studio";
        default:
            return name;
    }
};

export const IdealHouseType = () => {
    const { idealHouseType } = useSurveyContext().sankey;
    const labeledNodes = idealHouseType.nodes.map((node: { name: string }) => ({
        ...node,
        label: getLabel(node.name),
    }));

    return (
        <SurveyGraphCard title="What type of home do you want to live in?">
            <CustomSankey
                nodes={labeledNodes}
                links={idealHouseType.links}       
                leftLabel="I live in"
                rightLabel="I want to live in"
                >
            </CustomSankey>
        </SurveyGraphCard>
    )
}
