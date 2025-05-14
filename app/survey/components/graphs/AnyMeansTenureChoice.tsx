import React from "react"
import { SankeyResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey";
import { ResponsiveContainer } from "recharts";

export const AnyMeansTenureChoice: React.FC<SankeyResults> = ({ anyMeansTenureChoice }) => {
    return (
        <SurveyGraphCard title="What tenure would you choose?">
            <ResponsiveContainer>
                <CustomSankey
                    nodes={anyMeansTenureChoice.nodes}
                    links={anyMeansTenureChoice.links}            >
                </CustomSankey>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
