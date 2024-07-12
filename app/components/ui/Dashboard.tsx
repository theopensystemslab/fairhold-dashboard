import React from 'react';
import TenureComparisonWrapper from '../graphs/TenureComparisonWrapper'; 

interface DashboardProps {
    data: CalculatorResult; 
  }

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    return (
    <div>
      <h1>Dashboard</h1>
      {/* Render multiple graph components here */}
      <TenureComparisonWrapper calculatorResult={data} />
      {/* Add other graphs as needed */}
    </div>
  );
};

export default Dashboard;
