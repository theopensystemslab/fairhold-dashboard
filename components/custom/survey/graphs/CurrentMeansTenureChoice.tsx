import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey"
import { ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@context/surveyContext";

export const CurrentMeansTenureChoice: React.FC = () => {
    const { currentMeansTenureChoice } = useSurveyContext().surveyResults.sankey;
    const { loading } = useSurveyContext();

    return (
        <SurveyGraphCard title="Which tenure would you choose?" loading={loading}>
            <ResponsiveContainer width="100%" height="100%">
                <CustomSankey
                    nodes={currentMeansTenureChoice.nodes}
                    links={currentMeansTenureChoice.links}     
                    leftLabel="I live in"
                    rightLabel="I want to live in"   
                   >
                </CustomSankey>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
