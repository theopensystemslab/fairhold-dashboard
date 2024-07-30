import React from 'react';
import TenureComparisonWrapper from '../graphs/TenureComparisonWrapper'; 
import TotalPaymentWrapper from '../graphs/TotalPaymentWrapper';
import { Household } from '@/app/models/Household';

interface DashboardProps {
    data: Household; 
  }

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    return (
    <div>
      <h1>Dashboard</h1>
      {/* Render multiple graph components here */}
      <TenureComparisonWrapper household={data} />
      <TotalPaymentWrapper household={data} />
    </div>
  );
};

export default Dashboard;
