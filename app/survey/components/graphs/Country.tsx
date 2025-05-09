import React from "react";
import { Results } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer } from "recharts";
  
  export const Country: React.FC<Results> = ( results ) => {
    return (
      <SurveyGraphCard title="Which country?" results={results}>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <Pie data={results.uk} dataKey="value" nameKey="name" fill="rgb(var(--survey-placeholder))" />
            <Legend align="center" verticalAlign="bottom" />
            </PieChart>
        </ResponsiveContainer>
      </SurveyGraphCard>
    );
  };
