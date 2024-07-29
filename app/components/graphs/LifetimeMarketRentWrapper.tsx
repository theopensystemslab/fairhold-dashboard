<<<<<<< HEAD
=======
"use client";
import React from 'react';
import { Household, lifetimeTypes } from '@/app/models/Household';
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
    const chartData = (household.tenure.marketRent?.lifetime || []).map((item, index) => {
      // Access and store household.lifetime array 
      const incomeThreshold = household.lifetime && household.lifetime[index]
        ? household.lifetime[index].affordabilityThresholdIncome
        : 0;
      
        // Access and store all other variables
      return {
        year: index.toString(),
        landCost: item.averageRentLandYearly,
        houseCost: item.averageRentHouseYearly,
        // billsCost: item.gasBillYearly,
        incomeThreshold: incomeThreshold,
      };
  }) ?? [];

    console.log('LifetimeMarketRentWrapper.tsx chartData: ', chartData)

    return (
      <div>
        <h2>Lifetime Costs Chart</h2>
        <LifetimeCombinedChart data={chartData} colorScheme={colorScheme} />
      </div>
    );
};
  
export default LifetimeMarketRentWrapper;
>>>>>>> c0c4d4a (Refactored for new data structure)
