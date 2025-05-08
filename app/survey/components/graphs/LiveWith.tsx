import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { Sankey, Tooltip } from "recharts"; 

export const LiveWith: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="Who do you want to live with?" results={results}>
            <Sankey
                data={results.liveWith}
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
