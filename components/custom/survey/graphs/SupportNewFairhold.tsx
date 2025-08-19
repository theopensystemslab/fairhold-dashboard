import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer, Cell } from "recharts";
import { useSurveyContext } from "@context/surveyContext";


export const SupportNewFairhold = () => {
    const supportNewFairhold = useSurveyContext().barOrPie.supportNewFairhold;

    const COLORS = [
      "rgb(var(--fairhold-equity-color-rgb))", "rgb(var(--fairhold-interest-color-rgb))", "rgb(var(--survey-orange))", "rgb(var(--survey-pink))", "rgb(var(--social-rent-land-color-rgb))", "rgb(var(--survey-grey-light))"
    ];
    
    return (
        <SurveyGraphCard title="Would you support the creation of new Fairhold homes (or plots) in your area?">
             <ResponsiveContainer height={300}>
                <PieChart>
                    <Pie 
                        data={supportNewFairhold} 
                        dataKey="value" 
                        nameKey="answer" 
                        fill="rgb(var(--survey-placeholder))" 
                        innerRadius="60%"
                        outerRadius="80%"
                        >
                        {supportNewFairhold.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend 
                        align="left" 
                        verticalAlign="bottom" 
                        wrapperStyle={{ fontSize: 14 }}
                    />
             </PieChart>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
