import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import { useSurveyContext } from "../../context";
import { TENURE_COLORS } from "../../constants"
import { CustomLabelListContentProps } from "@/app/components/graphs/shared";

const RankLabel: React.FC<CustomLabelListContentProps> = ({ index, x, y }) => {
    const rank = typeof index === "number" ? index + 1 : "";
    return (
        <text
            x={Number(x) + 5}
            y={Number(y) + 15}
            fill="white"
            fontSize={12}
        >
            {rank}
        </text>
    );
};

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
                  tick={false}
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
                })}
                <LabelList 
                    dataKey="value"
                    position="insideStart"
                    fill="white"    
                    content={RankLabel}
                />
                </Bar>  
          </BarChart>
          </ResponsiveContainer>
        </SurveyGraphCard>
    )
}