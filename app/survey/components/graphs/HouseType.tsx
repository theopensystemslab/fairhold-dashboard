import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { Sankey, Tooltip } from "recharts"; 

export const HouseType: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="What type of home do you want to live in?" results={results}>
            <Sankey
                data={results.houseType}
                node={{stroke: "#77c878", strokeWidth: 2}}
                nodePadding={50}
                margin={{
                    left: 50,
                     right: 50,
                     top: 50,
                     bottom: 50,
                   }}
                >
                    <Tooltip />
                </Sankey>
        </SurveyGraphCard>
    )
}
