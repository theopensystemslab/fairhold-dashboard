"use client";

import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

// Define the props type for StackedBarChart
interface StackedBarChartProps {
  data: {
    category: string;
    marketPurchase: number;
    marketRent: number;
    socialRent: number;
    fairholdPurchase: number;
    fairholdRent: number;
  }[];
}

// Implementation of the D3 Stacked Bar Chart
const TenureComparison: React.FC<StackedBarChartProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Clear the SVG content before re-drawing
    d3.select(ref.current).selectAll("*").remove();

    // Set dimensions and margins
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Data transformation
    const categories = ["marketPurchase", "marketRent", "socialRent", "fairholdPurchase", "fairholdRent"];
    const processedData = categories.map(category => {
      return {
        key: category,
        land: data[0][category],
        house: data[1][category]
      };
    });

    // X and Y scales
    const x = d3.scaleBand()
      .domain(categories)
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.land + d.house) as number])
      .nice()
      .range([height, 0]);

    // X Axis
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text") // Select all text elements in the x-axis
      .style("fill", "black") // Set text color
      .style("font", "12px Inter"); // Set font

    // Y Axis
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y))
      .selectAll("text") // Select all text elements in the x-axis
      .style("fill", "black") // Set text color
      .style("font", "12px Inter"); // Set font

    // Colors for each layer
    const colors = { land: "#1f77b4", house: "#ff7f0e" };

    // Draw bars for the land values
    svg.selectAll(".bar-land")
      .data(processedData)
      .enter().append("rect")
      .attr("class", "bar-land")
      .attr("x", d => x(d.key) as number)
      .attr("y", d => y(d.land) as number)
      .attr("height", d => height - y(d.land))
      .attr("width", x.bandwidth())
      .attr("fill", colors.land);

    // Draw bars for the house values stacked on top of the land values
    svg.selectAll(".bar-house")
      .data(processedData)
      .enter().append("rect")
      .attr("class", "bar-house")
      .attr("x", d => x(d.key) as number)
      .attr("y", d => y(d.land + d.house) as number)
      .attr("height", d => height - y(d.house))
      .attr("width", x.bandwidth())
      .attr("fill", colors.house);

  }, [data]);

  return <svg ref={ref}></svg>;
};

export default TenureComparison;
