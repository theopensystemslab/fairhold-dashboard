import React from 'react';
import TenureComparisonWrapper from '../graphs/TenureComparisonWrapper'; 
import LifetimeMarketPurchaseWrapper from '../graphs/LifetimeMarketPurchaseWrapper'; 
import LifetimeMarketRentWrapper from '../graphs/LifetimeMarketRentWrapper'; 
import LifetimeFairholdLandPurchaseWrapper from '../graphs/LifetimeFairholdLandPurchaseWrapper'; 
import LifetimeFairholdLandRentWrapper from '../graphs/LifetimeFairholdLandRentWrapper'; 
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
      <LifetimeMarketPurchaseWrapper household={data} />
      <LifetimeMarketRentWrapper household={data} />
      <LifetimeFairholdLandPurchaseWrapper household={data} />
      <LifetimeFairholdLandRentWrapper household={data} />    </div> 

);
};

export default Dashboard;
