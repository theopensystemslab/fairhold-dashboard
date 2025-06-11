import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey";
import { ResponsiveContainer } from "recharts";
import { useSurveyContext } from "../../context";

export const AnyMeansTenureChoice = () => {
    const anyMeansTenureChoice = useSurveyContext().sankey.anyMeansTenureChoice;
    
    return (
        <SurveyGraphCard title="What tenure would you choose?">
            <ResponsiveContainer width="100%" height="100%">
                <CustomSankey
                    nodes={anyMeansTenureChoice.nodes}
                    links={anyMeansTenureChoice.links}            >
                </CustomSankey>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
