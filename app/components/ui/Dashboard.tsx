import React from 'react';
import TenureComparison from './TenureComparison'; 

const Dashboard = ({ data }) => {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Render multiple graph components here */}
      <TenureComparison data={data} />
      {/* Add other graphs as needed */}
    </div>
  );
};

export default Dashboard;
