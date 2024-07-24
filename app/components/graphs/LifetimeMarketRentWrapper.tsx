"use client";
import React from 'react';
import { Household, lifetimeTypes } from '@/sharedCode/classes';
import LifetimeCombinedChart from './LifetimeCombinedChart';

interface LifetimeMarketRentProps {
    household: Household;
  }

const LifetimeMarketRentWrapper: React.FC<LifetimeMarketRentProps> = ({ household }) => {
  console.log('LifetimeMarketRentWrapper household: ', household)

  // Create color scheme for different versions of the graph
    const colorScheme = {
      land: '#ad6800',
      house: '#f5ae45',
      maintenance: '#595959',
      bills: '#adadad',
      incomeThreshold: '#6c9e6e'
      }

    console.log('household.lifetime?.lifetimeMarketRent', household.tenure.marketRent?.lifetime)

    // Process and format the data for the chart
    const chartData = ((household.tenure.marketRent?.lifetime as lifetimeTypes[])?.map((item, index) => ({
      year: index.toString(),
      landCost: item.rentLandYearly,
      houseCost: item.rentHouseYearly,
      incomeThreshold: item.affordabilityThresholdIncome,
    })) ?? []);

    console.log('LifetimeMarketRentWrapper.tsx chartData: ', chartData)

    return (
      <div>
        <h2>Lifetime Costs Chart</h2>
        <LifetimeCombinedChart data={chartData} colorScheme={colorScheme} />
      </div>
    );
};
  
export default LifetimeMarketRentWrapper;