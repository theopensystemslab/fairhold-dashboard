import React from "react"
import { SankeyResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey";
import { ResponsiveContainer } from "recharts";

export const AnyMeansTenureChoice: React.FC<SankeyResults> = ({ anyMeansTenureChoice }) => {
    return (
        <SurveyGraphCard title="What tenure would you choose?">
            <ResponsiveContainer width="100%" height="100%">
                <CustomSankey
                    nodes={anyMeansTenureChoice.nodes}
                    links={anyMeansTenureChoice.links}
                    leftLabel="Current situation"
                    rightLabel="Ideal, with any means"
                    >
                </CustomSankey>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
