import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer, Cell } from "recharts";
import { useSurveyContext } from "@context/surveyContext";
import { BarOrPieResult } from "@/lib/survey/types";

export const Age: React.FC = () => {
    const { ageGroup } = useSurveyContext().surveyResults.barOrPie as { ageGroup: BarOrPieResult[] };
    const { loading } = useSurveyContext();
    
    const COLORS = [
      "rgb(var(--survey-grey-lightest))", "rgb(var(--survey-grey-light))", "rgb(var(--survey-grey-mid))", "rgb(var(--survey-grey-dark))", "rgb(var(--survey-black))"  
    ];

    const renderLegendText = (value: string) => (
        <span style={{ color: "rgb(var(--survey-grey-mid))" }}>{value}</span>
        );

    return (
        <SurveyGraphCard title="How old are you?" loading={loading}>
        {(animate) => (
            <div style={{ width: "100%", height: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={ageGroup} 
                            dataKey="value" 
                            nameKey="answer" 
                            fill="rgb(var(--survey-placeholder))" 
                            innerRadius="60%"
                            outerRadius="80%"
                            isAnimationActive={animate}
                            >
                            {ageGroup.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend 
                            align="left" 
                            verticalAlign="bottom" 
                            formatter={renderLegendText}
                            wrapperStyle={{ fontSize: 14 }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        )}
        </SurveyGraphCard>
    )
}
  