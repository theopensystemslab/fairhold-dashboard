import React from 'react';
import TenureComparisonWrapper from '../graphs/TenureComparisonWrapper'; 
import { Household } from '@/app/models/classes';

interface DashboardProps {
    data: Household; 
  }

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    return (
    <div>
      <h1>Dashboard</h1>
      {/* Render multiple graph components here */}
      <TenureComparisonWrapper household={data} />
      {/* Add other graphs as needed */}
    </div>
  );
};

export default Dashboard;
