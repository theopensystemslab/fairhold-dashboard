"use client";
import React from 'react';
import { Household } from '@/sharedCode/classes';
import LifetimeCombinedChart from './LifetimeCombinedChart';

interface Forecast {
    forecastMarket: {
      year: number;
      landPrice: number;
      newBuildPrice: number;
      maintenanceCost: number;
      gasBillYearly: number;
      affordableIncomeYearly: number;
    };
  }
  interface LifetimeCombinedWrapperProps {
    forecast: Forecast;
    colorScheme: {
      land: string;
      house: string;
      maintenance: string;
      bills: string;
      incomeThreshold: string;
    };
  }

  const LifetimeCombinedWrapper: React.FC<LifetimeCombinedWrapperProps> = ({ forecast, colorScheme }) => {
    // Process and format the data for the chart
    const chartData = forecast.forecastMarket.map(item => ({
      year: item.year.toString(),
      landCost: item.landPrice,
      houseCost: item.newBuildPrice,
      maintenanceCost: item.maintenanceCost,
      billsCost: item.gasBillYearly,
      incomeThreshold: item.affordableIncomeYearly,
    }));

    return (
      <div>
        <h2>Lifetime Costs Chart</h2>
        <LifetimeCombinedChart data={chartData} colorScheme={colorScheme} />
      </div>
    );
  };
  
  export default LifetimeCombinedWrapper;