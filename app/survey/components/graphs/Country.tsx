import React from "react";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "../../context";

  export const Country = () => {
    const uk = useSurveyContext().barOrPie.uk;
    
    return (
      <SurveyGraphCard title="Which country?">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <Pie 
              data={uk} 
              dataKey="value" 
              nameKey="answer" 
              fill="rgb(var(--survey-placeholder))" 
              innerRadius="40%"
              outerRadius="80%"
              />
            <Legend align="center" verticalAlign="bottom" />
            </PieChart>
        </ResponsiveContainer>
      </SurveyGraphCard>
    );
  };
