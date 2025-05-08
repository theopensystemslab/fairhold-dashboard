import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { Sankey, Tooltip } from "recharts"; 

export const AnyMeansTenureChoice: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="With any means, what tenure would you choose?" results={results}>
            <Sankey
                data={results.liveWith}
                node={{stroke: "#77c878", strokeWidth: 2}}
                nodePadding={50}
                margin={{
                    left: 20, 
                    right: 20, 
                    top: 20, 
                    bottom: 20, 
                }}
                >
                    <Tooltip/>
                </Sankey>
        </SurveyGraphCard>
    )
}