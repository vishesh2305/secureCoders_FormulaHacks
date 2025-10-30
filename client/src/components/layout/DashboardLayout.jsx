// src/components/layout/DashboardLayout.jsx

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import LandingNav from './LandingNav'; // <--- NEW IMPORT
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Header />
      <Sidebar />
      <LandingNav isDashboard={true} /> {/* <--- NEW COMPONENT FOR QUICK NAVIGATION */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default DashboardLayout;