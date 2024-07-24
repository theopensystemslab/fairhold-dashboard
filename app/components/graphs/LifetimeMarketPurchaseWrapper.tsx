"use client";
import React from 'react';
import { Household, lifetimeTypes } from '@/sharedCode/classes';
import LifetimeCombinedChart from './LifetimeCombinedChart';

interface LifetimeMarketPurchaseWrapperProps {
    household: Household;
  }

const LifetimeMarketPurchaseWrapper: React.FC<LifetimeMarketPurchaseWrapperProps> = ({ household }) => {
  console.log('LifetimeMarketPurchaseWrapper household: ', household)

  // Create color scheme for different versions of the graph
    const colorScheme = {
      land: '#194285',
      house: '#5178b8',
      maintenance: '#595959',
      bills: '#adadad',
      incomeThreshold: '#6c9e6e'
      }

    console.log('household.tenure.marketPurchase.lifetime?.lifetimeMarket', household.tenure.marketPurchase?.lifetime)

    // Process and format the data for the chart
    const chartData = ((household.tenure.marketPurchase?.lifetime as lifetimeTypes[])?.map((item, index) => ({
      year: index.toString(), // or just `year: index` if you want it as a number
      landCost: item.landMortgagePaymentYearly,
      houseCost: item.houseMortgagePaymentYearly,
      maintenanceCost: item.maintenanceCost,
      billsCost: item.gasBillYearly,
      incomeThreshold: item.affordabilityThresholdIncome,
    })) ?? []);

    console.log('LifetimeMarketPurchaseWrapper.tsx chartData: ', chartData)

    return (
      <div>
        <h2>Lifetime Costs Chart</h2>
        <LifetimeCombinedChart data={chartData} colorScheme={colorScheme} />
      </div>
    );
};
  
export default LifetimeMarketPurchaseWrapper;