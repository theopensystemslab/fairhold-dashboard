import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { useSurveyContext } from "../../context";
import { TENURE_COLORS } from "../../constants"

export const AnyMeansTenureChoice = () => {
    const { anyMeansTenureChoice } = useSurveyContext().barOrPie;
    return (
        <SurveyGraphCard 
            title="What tenure would you choose?"
            subtitle="If you could afford (and were eligible for) any type of home, which would you prefer?"
            >
          <ResponsiveContainer height={anyMeansTenureChoice.length * 30}>
          <BarChart
              data={anyMeansTenureChoice}
              barSize={20}
              barGap={0}
              layout="vertical"
          >
              <XAxis 
                  type="number"
                  height={20}
                  fontSize={10}
                  interval={10}
                  axisLine={false}
                  tickLine={false}
                  tick={true}
                  /> 
              <YAxis 
                  type="category"    
                  dataKey="answer" 
                  width={350} 
                  fontSize={10}
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                  /> 
              <Bar dataKey="value">
                        {anyMeansTenureChoice.map((entry, index) => {
                            let answerStr = "";
                            if (Array.isArray(entry.answer)) {
                                answerStr = entry.answer[0] ?? "";
                            } else if (typeof entry.answer === "string") {
                                answerStr = entry.answer;
                            }
                            return (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={TENURE_COLORS[answerStr] || "#ccc"}
                                />
                            );
                        }
                    )}
                    </Bar>  
          </BarChart>
          </ResponsiveContainer>
        </SurveyGraphCard>
    )
}