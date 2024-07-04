"use client";
import React from 'react';
import TenureComparison from '../components/TenureComparison';

const TestTenureComparison = () => {
    // Sample data to test the chart
    const sampleData = [
      {
        category: 'Monthly Costs Land',
        marketPurchase: 1200,
        marketRent: 1000,
        socialRent: 200,
        fairholdPurchase: 800,
        fairholdRent: 700,
      },
      {
        category: 'Monthly Costs House',
        marketPurchase: 500,
        marketRent: 400,
        socialRent: 100,
        fairholdPurchase: 500,
        fairholdRent: 500,
      },
    ];
  
    return (
      <div>
        <h1>Test Stacked Bar Chart</h1>
        <TenureComparison data={sampleData} />
      </div>
    );
  };
  
  export default TestTenureComparison;
  