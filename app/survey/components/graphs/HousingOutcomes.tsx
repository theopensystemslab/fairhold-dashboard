import React from "react"
import { TickProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "../../context";

export const HousingOutcomes = () => {
    const housingOutcomes = useSurveyContext().barOrPie.housingOutcomes;

    const Tick = (props: TickProps) => {
        const { x, y, payload } = props;
        return (
            <g transform={`translate(${x},${y})`}>
            <text 
                x={-10} 
                y={0} 
                dy={4} 
                textAnchor="end" 
                fill="#333" 
                fontSize={10}
                width={240}
            >
                {payload.value}
            </text>
            </g>
        );
    }

    return (
        <SurveyGraphCard title="What do you most want from housing that you don't currently get?">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={housingOutcomes}
                    barSize={20}
                    layout="vertical"
                >
                    <XAxis type="number" /> 
                    <YAxis 
                        type="category"    
                        dataKey="answer" 
                        width={350} 
                        fontSize={10}
                        interval={0}
                        tick={Tick}/> 
                    <Bar dataKey="value" fill="rgb(var(--survey-placeholder))" /> 
                </BarChart>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
