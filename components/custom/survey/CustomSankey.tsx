import React from "react"
import { Sankey, Tooltip, Rectangle, ResponsiveContainer } from "recharts"; 


type CustomNodeProps = {
    x: number;
    y: number;
    width: number;
    height: number;
    index: number;
    payload: NodePayload;
}

type NodePayload = {
    name: string;
    sourceNodes: [];
    sourceLinks: [];
    targetLinks: [];
    targetNodes: [];
    value: number;
    depth: number;
    x: number;
    dx: number;
    y: number;
    dy: number;
}

type CustomLinkProps = {
    sourceX: number;
    targetX: number;
    sourceY: number;
    targetY: number;
    sourceControlX: number;
    targetControlX: number;
    sourceRelativeY: number;
    targetRelativeY: number;
    linkWidth: number;
    index: number;
    payload: CustomLinkPayload;
}

type CustomLinkPayload = {
    source: {
        name: string;
        sourceNodes: [];
        sourceLinks: [];
        targetLinks: [];
        targetNodes: [];
        value: number;
        depth: number;
        x: number;
        dx: number;
        y: number;
        dy: number;
    },
    target: {
        name: string;
        sourceNodes: [];
        sourceLinks: [];
        targetLinks: [];
        targetNodes: [];
        value: number;
        depth: number;
        x: number;
        dx: number;
        y: number;
        dy: number;
    },
    value: number;
    dy: number;
    sy: number;
    ty: number;
}

type SankeyProps = {
    nodes: Array<{name: string}>;
    links: Array<{source: number, target: number, value: number}>;
    leftLabel?: string;
    rightLabel?: string;
};

export const CustomSankey: React.FC<SankeyProps> = ({ 
    nodes, 
    links,
    leftLabel,
    rightLabel
}) => {

    // Custom Node Component with Label 
    const CustomNode = (props: CustomNodeProps) => { 
        const isLeft = props.payload.depth === 0;
        return ( 
            <g> 
                <Rectangle 
                    {...props} 
                    fill={"rgb(var(--fairhold-equity-color-rgb))"} 
                /> 
                <text 
                    x={isLeft ? props.x - 80 : props.x + props.width + 80}
                    y={props.y + props.height / 2} 
                    textAnchor={props.payload.depth === 0 ? "start" : "end"}
                    dominantBaseline="middle" 
                    fill="rgb(var(--text-default-rgb))" 
                    fontSize={12} 
                > 
                    {props.payload.name} 
                </text> 
            </g> 
        ); 
    }; 

    // Custom Link Component with Label 
    const CustomLink = (props: CustomLinkProps) => { 
        const { sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, payload } = props; 

        // Calculate a midpoint for the label 
        const midX = (sourceX + targetX) / 2; 
        const midY = (props.sourceY + props.targetY) / 2; 

        return ( 
            <g> 
                <path 
                    d={`M${sourceX},${sourceY}C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`} 
                    fill="none" 
                    stroke={"rgb(var(--fairhold-equity-color-rgb))"} 
                    strokeOpacity={0.5} 
                    strokeWidth={linkWidth} 
                /> 
                {linkWidth > 5 && ( // Only show labels if link is wide enough 
                    <text 
                        x={midX} 
                        y={midY} 
                        textAnchor="middle" 
                        dominantBaseline="middle" 
                        fill="#333" 
                        fontSize={10} 
                        pointerEvents="none" 
                    > 
                        {payload.value} 
                    </text> 
                )} 
            </g> 
        ); 
    }; 

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "0 2rem 0 2rem",
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 1,
                height: 40
            }}>
                <span>{leftLabel}</span>
                <span>{rightLabel}</span>
            </div>
            {/* Sankey chart below labels */}
            <div style={{ width: "100%", height: "calc(100% - 40px)", marginTop: 40 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <Sankey
                        data={{
                            nodes: nodes,
                            links: links
                        }}
                        node={CustomNode}
                        link={CustomLink}
                        nodePadding={50}
                        margin={{
                            left: 150,
                            right: 100,
                            top: 50,
                            bottom: 50,
                        }}
                    >
                        <Tooltip />
                    </Sankey>
                </ResponsiveContainer>
            </div>
        </div>
    )
}