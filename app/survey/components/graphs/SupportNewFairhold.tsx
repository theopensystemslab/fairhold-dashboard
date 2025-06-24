import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer, Cell } from "recharts";
import { useSurveyContext } from "../../context";
import { SUPPORT_FAIRHOLD_ORDER } from "../../constants";


export const SupportNewFairhold = () => {
    let supportNewFairhold = useSurveyContext().barOrPie.supportNewFairhold;

    supportNewFairhold = supportNewFairhold.slice().sort(
        (a, b) =>
            SUPPORT_FAIRHOLD_ORDER.indexOf(a.answer as string) -
            SUPPORT_FAIRHOLD_ORDER.indexOf(b.answer as string)
        );

    const COLORS = [
      "rgb(var(--fairhold-equity-color-rgb))", "rgb(var(--fairhold-interest-color-rgb))", "rgb(var(--survey-orange))", "rgb(var(--survey-pink))", "rgb(var(--social-rent-land-color-rgb))", "rgb(var(--survey-grey-light))"
    ];
    
    return (
        <SurveyGraphCard title="Would you support the creation of new Fairhold homes (or plots) in your area?">
             <ResponsiveContainer width="100%" height="100%">
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
                    <Legend align="center" verticalAlign="bottom" />
             </PieChart>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
