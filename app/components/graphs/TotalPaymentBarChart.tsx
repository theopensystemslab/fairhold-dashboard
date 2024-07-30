"use client";

import React, { useEffect, useRef } from 'react';
import {
    Chart,
    ChartData,
    BarElement,
    BarController,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';

Chart.register(BarElement, BarController, CategoryScale, LinearScale);

// Define type for DataInput
type DataInput = {
    paymentType: string;
    marketPurchase: number;
    marketRent: number;
    fairholdLandPurchase: number;
    fairholdLandRent: number;
}

interface TotalPaymentProps {
    data: DataInput[];
}

// Implementation of bar chart
const TotalPaymentBarChart: React.FC<TotalPaymentProps> = ({ data }) => {
    console.log('TotalPaymentBarChart data: ', data);

    const ref = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        
        const tenures = ["marketPurchase", "marketRent", "fairholdLandPurchase", "fairholdLandRent"];
        const labels = tenures;
        const chartDataValues = tenures.map(tenure => (data[0] as DataInput)[tenure as keyof DataInput] as number);

        const chartData: ChartData<'bar'> = {
            labels: labels,
            datasets: [
                {
                    label: 'Total Payments',
                    data: chartDataValues,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                }
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
                        stacked: false,
                        title: {
                            display: true,
                            text: 'Total payments over lifetime',
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

    return <canvas id={`chart-total-payment-compare`} ref={ref}></canvas>;
};

export default TotalPaymentBarChart;