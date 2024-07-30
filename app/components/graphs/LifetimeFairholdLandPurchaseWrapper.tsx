"use client";
import React from 'react';
import { Household } from '@/app/models/Household';
import LifetimeCombinedChart from './LifetimeCombinedChart';

interface LifetimeFairholdLandPurchaseWrapperProps {
    household: Household;
}

const LifetimeFairholdLandPurchaseWrapper: React.FC<LifetimeFairholdLandPurchaseWrapperProps> = ({ household }) => {
  console.log('LifetimeFairholdLandPurchaseWrapper household: ', household)

  // Create color scheme for different versions of the graph
  const colorScheme = {
    land: '#026600',
    house: '#78ba77',
    maintenance: '#595959',
    bills: '#adadad',
    incomeThreshold: '#6c9e6e'
    }

    console.log('household.tenure.fairholdLandPurchase.lifetime?', household.tenure.fairholdLandPurchase?.lifetime)

    // Process and format the data for the chart
    const chartData = (household.tenure.fairholdLandPurchase?.lifetime || []).map((item, index) => {
      // Access and store household.lifetime array 
      const incomeThreshold = household.lifetime && household.lifetime[index]
        ? household.lifetime[index].affordabilityThresholdIncome
        : 0;
      
        // Access and store all other variables
      return {
        year: index.toString(),
        landCost: item.landMortgagePaymentYearly,
        houseCost: item.houseMortgagePaymentYearly,
        // billsCost: item.gasBillYearly,
        maintenanceCost: item.maintenanceCost,
        incomeThreshold: incomeThreshold,
      };
    }) ?? [];

    console.log('LifetimeCombinedWrapper.tsx chartData: ', chartData)

    return (
      <div>
        <h2>Lifetime Costs Chart</h2>
        <LifetimeCombinedChart data={chartData} colorScheme={colorScheme} />
      </div>
    );
};
  
export default LifetimeFairholdLandPurchaseWrapper;