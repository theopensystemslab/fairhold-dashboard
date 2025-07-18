import { formatValue } from "@/app/lib/format";

export interface CustomLabelListContentProps {
  x?: number | string | undefined;
  y?: number | string | undefined;
  value?: number | string;
  index?: number;
  color?: string | undefined;
  width?: string | number | undefined;
  height?: string | number | undefined;
}

export const BarLabelListTopLeft: React.FC<CustomLabelListContentProps> = ({
  x,
  y,
  value,
  color,
}) => {
  if (x === undefined || y === undefined || value === undefined) return null;
  const xAdjust = 2;
  const yAdjust = 30;
  const xPos = typeof x === "number" ? x - xAdjust : Number(x) - xAdjust;
  const yPos = typeof y === "number" ? y - yAdjust : Number(y) - yAdjust;
  const numValue =
    typeof value === "number" ? value : parseFloat(value as string);
  const formattedValue = formatValue(numValue);

  return (
    <text
      x={xPos}
      y={yPos}
      fill={color}
      fontSize={18}
      fontWeight={600}
      textAnchor="start"
      dominantBaseline="hanging"
    >
      {formattedValue}
    </text>
  );
};

export interface CustomTickProps {
  x: number;
  y: number;
  payload: { value: string };
  getLabel: (value: string) => string;
  getColor: (value: string, index?: number) => string;
  index?: number;
}

export const CustomTick: React.FC<CustomTickProps> = ({
  x,
  y,
  payload,
  getLabel,
  getColor,
  index,
}) => {
  const label = getLabel(payload.value);
  const color = getColor(payload.value, index);

  return (
    <g transform={`translate(${x},${y})`}>
      {label.split("\n").map((line: string, i: number) => (
        <text
          key={i}
          x={0}
          y={i * 20}
          dy={10}
          textAnchor="middle"
          style={{ fill: color }}
          fontSize="12px"
          fontWeight={600}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

export const getLabel = (value: string) => {
  switch (value) {
    case "Freehold":
      return "Freehold";
    case "Private Rent":
      return "Private Rent";
    case "Fairhold - Land Purchase":
      return "Fairhold /\nLand Purchase";
    case "Fairhold - Land Rent":
      return "Fairhold /\nLand Rent";
    case "Social Rent":
      return "Social Rent";
    default:
      return value;
  }
};

export const getColor = (value: string) => {
  switch (value) {
    case "Freehold":
      return "rgb(var(--freehold-equity-color-rgb))";
    case "Private Rent":
      return "rgb(var(--private-rent-land-color-rgb))";
    case "Fairhold - Land Purchase":
      return "rgb(var(--fairhold-equity-color-rgb))";
    case "Fairhold - Land Rent":
      return "rgb(var(--fairhold-interest-color-rgb))";
    case "Social Rent":
      return "rgb(var(--social-rent-land-color-rgb))";
    default:
      return "rgb(var(--fairhold-equity-color-rgb))";
  }
};
