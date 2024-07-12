"use client";
import React from 'react';
import TenureComparison from '../components/ui/TenureComparison';

const TestTenureComparison = () => {
  const formattedData = (calculatorResult) => {
    return [
      {
        category: 'Monthly Costs Land',
        marketPurchase: calculatorResult.mortgageLand?.monthlyPayment || 0,
        marketRent: calculatorResult.originalLandRent || 0,
        socialRent: calculatorResult.adjustedSocialRentMonthly || 0,
        fairholdLandPurchase: calculatorResult.mortgageFairholdLandPurchase?.monthlyPayment || 0,
        fairholdLandRent: calculatorResult.fairholdLandRent || 0,
      },
      {
        category: 'Monthly Costs House',
        marketPurchase: calculatorResult.mortgageHouse?.monthlyPayment || 0,
        marketRent: calculatorResult.averageRentHouse || 0,
        socialRent: calculatorResult.socialRentMonthlyHouse || 0,
        fairholdLandPurchase: calculatorResult.mortgageFairholdLandPurchase?.monthlyPayment || 0,
        fairholdLandRent: calculatorResult.fairholdLandRent || 0,
      }
    ];
  };
  
    return (
      <div>
        <h1>Test Stacked Bar Chart</h1>
        <TenureComparison data={formattedData} />
      </div>
    );
  };
  
  export default TestTenureComparison;
  