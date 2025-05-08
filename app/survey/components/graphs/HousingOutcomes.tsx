import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";

export const HousingOutcomes: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="What do you most want from housing that you don't currently get?" results={results}>
            <BarChart
                data={results.housingOutcomes}
                barSize={20}
                layout="vertical"
            >
                <XAxis type="number" /> 
                <YAxis 
                    type="category"    
                    dataKey="name" 
                    width={250} 
                    fontSize={10}
                    interval={0}
                    tick={(props) => {
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
                    }}/> 
                <Bar dataKey="value" fill="#8884d8" /> 
                <Tooltip />
            </BarChart>
        </SurveyGraphCard>
    )
}
