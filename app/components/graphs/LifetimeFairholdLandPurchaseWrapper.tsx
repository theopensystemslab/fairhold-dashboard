"use client";
import React from 'react';
import { Household } from '@/sharedCode/classes';
import LifetimeCombinedChart from './LifetimeCombinedChart';

// Create colour scheme types
type SchemeType = 'default' | 'alternative' | 'monochrome';

interface LifetimeCombinedWrapperProps {
    household: Household;
    schemeType: SchemeType;
  }

interface LifetimeCombinedWrapperProps {
    household: Household;
}

const LifetimeCombinedWrapper: React.FC<LifetimeCombinedWrapperProps> = ({ household, schemeType  }) => {
  console.log('LifetimeCombinedWrapper household: ', household)

  // Create color schemes for different versions of the graph
    const colorSchemes = {
        default: {
          land: '#FF0000',
          house: '#00FF00',
          maintenance: '#0000FF',
          bills: '#FFFF00',
          incomeThreshold: '#FF00FF',
        },
        alternative: {
          land: '#800000',
          house: '#008000',
          maintenance: '#000080',
          bills: '#808000',
          incomeThreshold: '#800080',
        },
        monochrome: {
          land: '#000000',
          house: '#333333',
          maintenance: '#666666',
          bills: '#999999',
          incomeThreshold: '#CCCCCC',
        },
      };

    const colorScheme = colorSchemes[schemeType];

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

    console.log('LifetimeCombinedWrapper.tsx chartData: ', chartData)

    return (
      <div>
        <h2>Lifetime Costs Chart</h2>
        <LifetimeCombinedChart data={chartData} colorScheme={colorScheme} />
      </div>
    );
};
  
export default LifetimeCombinedWrapper;