"use client";
import React from 'react';
import { Household } from '@/sharedCode/classes';
import LifetimeCombinedChart from './LifetimeCombinedChart';

interface LifetimeCombinedWrapperProps {
    household: Household;
  }

const LifetimeMarketPurchaseWrapper: React.FC<LifetimeCombinedWrapperProps> = ({ household }) => {
  console.log('LifetimeMarketPurchaseWrapper household: ', household)

  // Create color scheme for different versions of the graph
    const colorScheme = {
      land: '#194285',
      house: '#5178b8',
      maintenance: '#595959',
      bills: '#adadad',
      incomeThreshold: '#6c9e6e'
      }

    console.log('household.lifetime?.lifetimeMarket', household.lifetime?.lifetimeMarket)

    // Process and format the data for the chart
    const chartData = household.lifetime?.lifetimeMarket
    ? household.lifetime.lifetimeMarket.map(item => ({
        year: item.year.toString(),
        landCost: item.landPrice,
        houseCost: item.newBuildPrice,
        maintenanceCost: item.maintenanceCost,
        billsCost: item.gasBillYearly,
        incomeThreshold: item.affordabilityThresholdIncome,
      }))
    : [];

    console.log('LifetimeMarketPurchaseWrapper.tsx chartData: ', chartData)

    return (
      <div>
        <h2>Lifetime Costs Chart</h2>
        <LifetimeCombinedChart data={chartData} colorScheme={colorScheme} />
      </div>
    );
};
  
export default LifetimeMarketPurchaseWrapper;