"use client";
import React from 'react';
import { Household } from '@/sharedCode/classes';
import LifetimeCombinedChart from './LifetimeCombinedChart';

interface LifetimeCombinedWrapperProps {
    household: Household;
  }

const LifetimeMarketRentWrapper: React.FC<LifetimeCombinedWrapperProps> = ({ household }) => {
  console.log('LifetimeMarketRentWrapper household: ', household)

  // Create color scheme for different versions of the graph
    const colorScheme = {
      land: '#ad6800',
      house: '#f5ae45',
      maintenance: '#595959',
      bills: '#adadad',
      incomeThreshold: '#6c9e6e'
      }

    console.log('household.lifetime?.lifetimeMarketRent', household.lifetime?.lifetimeMarket)

    // Process and format the data for the chart
    const chartData = household.lifetime?.lifetimeMarket
    ? household.lifetime.lifetimeMarket.map(item => ({
        year: item.year.toString(),
        landCost: item.landPrice,
        houseCost: item.newBuildPrice,
        billsCost: item.gasBillYearly,
        incomeThreshold: item.affordabilityThresholdIncome,
      }))
    : [];

    console.log('LifetimeMarketRentWrapper.tsx chartData: ', chartData)

    return (
      <div>
        <h2>Lifetime Costs Chart</h2>
        <LifetimeCombinedChart data={chartData} colorScheme={colorScheme} />
      </div>
    );
};
  
export default LifetimeMarketRentWrapper;