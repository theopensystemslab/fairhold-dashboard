import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey"
import { ResponsiveContainer } from "recharts";
import { useSurveyContext } from "../../context";

export const CurrentMeansTenureChoice = () => {
    const currentMeansTenureChoice = useSurveyContext().sankey.currentMeansTenureChoice;
    
    return (
        <SurveyGraphCard title="Could you afford a Fairhold home in your area?">
            <ResponsiveContainer width="100%" height="100%">
                <CustomSankey
                    nodes={currentMeansTenureChoice.nodes}
                    links={currentMeansTenureChoice.links}            >
                </CustomSankey>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
