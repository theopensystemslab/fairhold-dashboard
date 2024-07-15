"use client";
import React from 'react';
import TenureComparisonBarChart from './TenureComparisonBarChart';

interface CalculatorResult {
  mortgageLand?: { monthlyPayment: number };
  originalLandRent?: number;
  socialRentMonthlyLand?: number; 
  mortgageFairholdLandPurchase?: { monthlyPayment: number };
  fairholdLandRent?: number;
  mortgageHouse?: { monthlyPayment: number };
  averageRentHouse?: number;
  socialRentMonthlyHouse?: number;
}

interface TenureComparisonWrapperProps {
  calculatorResult: CalculatorResult;
}

const TenureComparisonWrapper: React.FC<TenureComparisonWrapperProps> = ({ calculatorResult }) => {
  console.log('TenureComparisonWrapper calculatorResult:', calculatorResult);
  
  if (!calculatorResult) {
    return <div>No calculator result available</div>;
  }
  
  const formatData = (result: CalculatorResult) => {
    return [
      {
        category: 'Monthly Costs Land',
        marketPurchase: result.mortgageLand?.monthlyPayment || 0,
        marketRent: result.averageRentLand || 0,
        socialRent: result.socialRentMonthlyLand || 0,
        fairholdLandPurchase: result.mortgageFairholdLandPurchase?.monthlyPayment || 0,
        fairholdLandRent: result.fairholdLandRent?.discountedLandRent || 0,
      },
      {
        category: 'Monthly Costs House',
        marketPurchase: result.mortgageHouse?.monthlyPayment || 0,
        marketRent: result.averageRentHouse || 0,
        socialRent: result.socialRentMonthlyHouse || 0,
        fairholdLandPurchase: result.mortgageDepreciatedHouse?.monthlyPayment || 0,
        fairholdLandRent: result.mortgageDepreciatedHouse?.monthlyPayment || 0,
      }
    ];
  };
  
  const formattedData = formatData(calculatorResult);

  return (
    <div>
      <h2>Tenure Comparison Chart</h2>
      <TenureComparisonBarChart data={formattedData} />
    </div>
  );
};

export default TenureComparisonWrapper;