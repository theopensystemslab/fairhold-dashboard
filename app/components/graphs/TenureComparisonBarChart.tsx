"use client";

import React, { useEffect, useRef } from 'react';
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend);

// Define the props type for StackedBarChart
interface StackedBarChartProps {
  data: {
    category: string;
    marketPurchase: number;
    marketRent: number;
    socialRent: number;
    fairholdLandPurchase: number;
    fairholdLandRent: number;
  }[];
}

// Implementation of the Chart.js Stacked Bar Chart
const TenureComparisonBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
  console.log('TenureComparisonBarChart data: ', data);
  
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Transform the data into a format suitable for Chart.js
    const categories = ["marketPurchase", "marketRent", "socialRent", "fairholdLandPurchase", "fairholdLandRent"];
    const labels = categories;
    const landData = categories.map(category => data[0][category]);
    const houseData = categories.map(category => data[1][category]);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Land',
          data: landData,
          backgroundColor: '#1f77b4',
        },
        {
          label: 'House',
          data: houseData,
          backgroundColor: '#ff7f0e',
        },
      ]
    };

    // Clear the canvas before re-drawing
    if (ref.current.chartInstance) {
      ref.current.chartInstance.destroy();
    }

    const chartInstance = new Chart(ref.current, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Category',
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: 'Value',
            },
          },
        },
      },
    });

    ref.current.chartInstance = chartInstance;

    // Cleanup function to destroy the chart instance when the component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data]);

  return <canvas ref={ref}></canvas>;
};

export default TenureComparisonBarChart;
