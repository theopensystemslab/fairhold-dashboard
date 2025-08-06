import { TickProps } from "@lib/survey/types";

const CustomTick = (props: TickProps, color?: string) => {
      const { x, y, payload } = props;
      return (
        <g transform={`translate(${x},${y})`}>
          <text 
            x={-10} 
            y={0} 
            dy={4} 
            textAnchor="end" 
            fill={color || "#333"} 
            fontSize={12}
            width={240}
          >
            {payload.value}
          </text>
        </g>
      );
  }

  export default CustomTick;