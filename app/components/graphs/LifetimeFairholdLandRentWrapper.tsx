"use client";
import React from 'react';
import { Household, lifetimeTypes } from '@/app/models/Household';
import LifetimeCombinedChart from './LifetimeCombinedChart';

interface LifetimeCombinedWrapperProps {
    household: Household;
  }

const LifetimeFairholdLandRentWrapper: React.FC<LifetimeCombinedWrapperProps> = ({ household }) => {
  console.log('LifetimeFairholdLandRentWrapper household: ', household)

  // Create color scheme for different versions of the graph
    const colorScheme = {
      land: '#6c2091',
      house: '#b275d1',
      maintenance: '#595959',
      bills: '#adadad',
      incomeThreshold: '#6c9e6e'
      }

    console.log('household.lifetime?.lifetimeMarket', household.tenure.fairholdLandRent?.lifetime)

    // Process and format the data for the chart
    const chartData = (household.tenure.fairholdLandRent?.lifetime || []).map((item, index) => {
      // Access and store household.lifetime array 
      const incomeThreshold = household.lifetime && household.lifetime[index]
        ? household.lifetime[index].affordabilityThresholdIncome
        : 0;
      
        // Access and store all other variables
      return {
      year: index.toString(),
      landCost: item.fairholdRentLand,
      houseCost: item.houseMortgagePaymentYearly,
      maintenanceCost: item.maintenanceCost,
      // billsCost: item.gasBillYearly,
      incomeThreshold: incomeThreshold,
    };
  }) ?? [];

    console.log('LifetimeFairholdLandRentWrapper.tsx chartData: ', chartData)

    return (
      <div>
        <h2>Lifetime Costs Chart</h2>
        <LifetimeCombinedChart data={chartData} colorScheme={colorScheme} />
      </div>
    );
};
  
export default LifetimeFairholdLandRentWrapper;