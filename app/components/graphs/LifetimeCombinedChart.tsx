"use client";

import React, { useEffect, useRef } from 'react';
import {
    Chart,
    ChartData,
    ChartDataset,
    ChartOptions,
    ChartTypeRegistry,
    PointElement,
    BarElement,
    BarController,
    LineController, 
    LineElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';

Chart.register(PointElement, BarElement, BarController, LineController, LineElement, CategoryScale, LinearScale, Tooltip, Legend);

type DataInput = {
    year: string;
    landCost: number;
    houseCost: number;
    maintenanceCost?: number;
    billsCost?: number;
    incomeThreshold: number;
}

interface ColorScheme {
    land: string;
    house: string;
    maintenance: string;
    bills: string;
    incomeThreshold: string;
}

interface LifetimeChartProps {
    data: DataInput[];
    colorScheme: ColorScheme;
}

// Implementation of combination bar and line chart
const LifetimeCombinedChart: React.FC<LifetimeChartProps> = ({ data, colorScheme }) => {

    const ref = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        // Transform the data into a format suitable for Chart.js
        const years = data.map(item => item.year);
        const landData = data.map(item => item.landCost);
        const houseData = data.map(item => item.houseCost);
        const maintenanceData = data.map(item => item.maintenanceCost ?? null);
        const billsData = data.map(item => item.billsCost ?? null);
        const affordabilityThreshold = data.map(item => item.incomeThreshold);

        const datasets: ChartDataset<'bar' | 'line', number[]>[] = [
          {
              type: 'bar',
              label: 'Land',
              data: landData,
              backgroundColor: colorScheme.land,
              order: 1,
          },
          {
              type: 'bar',
              label: 'House',
              data: houseData,
              backgroundColor: colorScheme.house,
              order: 2,
          },
          {
              type: 'line',
              label: 'Affordability threshold',
              data: affordabilityThreshold,
              borderColor: colorScheme.incomeThreshold,
              backgroundColor: 'transparent',
              order: 0,
          },
      ];
      // Only add maintenance data if it exists
      if (maintenanceData.some(value => value !== null)) {
          datasets.push({
              type: 'bar',
              label: 'Maintenance',
              data: maintenanceData.map(value => value ?? 0),
              backgroundColor: colorScheme.maintenance,
              order: 3,
          });
      }
      // Only add bills data if it exists
      if (billsData.some(value => value !== null)) {
          datasets.push({
              type: 'bar',
              label: 'Bills',
              data: billsData.map(value => value ?? 0),
              backgroundColor: colorScheme.bills,
              order: 2,
          });
      }

        const chartData: ChartData<'bar' | 'line', number[], string> = {
            labels: years,
            datasets: datasets,
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
                    text: 'Year',
                  },
                },
                y: {
                  stacked: true,
                  title: {
                    display: true,
                    text: 'Yearly payments',
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
    }, [data, colorScheme]);

  return <canvas id={`chart-${colorScheme}`} ref={ref}></canvas>;
};

export default LifetimeCombinedChart;