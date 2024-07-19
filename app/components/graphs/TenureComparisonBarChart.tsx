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

// Define type for DataInput
type DataInput = {
  category: string;
  marketPurchase: number;
  marketRent: number;
  socialRent: number;
  fairholdLandPurchase: number;
  fairholdLandRent: number;
  [key: string]: string | number;
};


// Define the props type for StackedBarChart
interface StackedBarChartProps {
  data: DataInput[];
}

// Implementation of the Chart.js Stacked Bar Chart
const TenureComparisonBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
  console.log('TenureComparisonBarChart data: ', data);
  
  const ref = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Transform the data into a format suitable for Chart.js
    const categories = ["marketPurchase", "marketRent", "socialRent", "fairholdLandPurchase", "fairholdLandRent"];
    const labels = categories;
    const landData = categories.map(category => (data[0] as DataInput)[category] as number);
    const houseData = categories.map(category => (data[1] as DataInput)[category] as number);

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
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const newChartInstance = new Chart(ref.current, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Tenure type',
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: 'Monthly payments',
            },
          },
        },
      },
    });

    chartRef.current = newChartInstance;

    // Cleanup function to destroy the chart instance when the component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas id={`chart-tenure-compare`} ref={ref}></canvas>;
};

export default TenureComparisonBarChart;
