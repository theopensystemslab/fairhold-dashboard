import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer, Cell } from "recharts";
import { useSurveyContext } from "../../context";
import { SUPPORT_DEVELOPMENT_ORDER } from "../../constants";

export const SupportDevelopment = () => {
    let { supportDevelopment } = useSurveyContext().barOrPie;
    
    supportDevelopment = supportDevelopment.slice().sort(
        (a, b) =>
            SUPPORT_DEVELOPMENT_ORDER.indexOf(a.answer as string) -
            SUPPORT_DEVELOPMENT_ORDER.indexOf(b.answer as string)
        );
        
    const COLORS = [
      "rgb(var(--fairhold-equity-color-rgb))", "rgb(var(--fairhold-interest-color-rgb))", "rgb(var(--survey-orange))", "rgb(var(--survey-pink))", "rgb(var(--social-rent-land-color-rgb))", "rgb(var(--survey-grey-light))"
    ];

    return (
        <SurveyGraphCard title="Would you support development in general?">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie 
                        data={supportDevelopment} 
                        dataKey="value" 
                        nameKey="answer" 
                        fill="rgb(var(--survey-placeholder))"
                        innerRadius="60%"
                        outerRadius="80%"
                        >
                        {supportDevelopment.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend align="center" verticalAlign="bottom" />
             </PieChart>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
