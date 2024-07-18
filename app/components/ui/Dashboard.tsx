import React from 'react';
import TenureComparisonWrapper from '../graphs/TenureComparisonWrapper'; 
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
      <LifetimeCombinedWrapper household={data} schemeType="default" />
    </div>
  );
};

export default Dashboard;
